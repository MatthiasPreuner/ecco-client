import * as React from "react";
import { FileWithPath } from 'react-dropzone'
import { useState, useEffect } from "react";
import { useSharedState } from "../../../states/AppState";

import { Col, Row, Form, Button, InputGroup } from 'react-bootstrap';
import { SpinButtonGroup } from "../../common/SpinButtonGroup";
import { FeatureSelector, FeatureSelectorFeature } from "../../common/FeatureSelector";

interface FeatureRowProps {
    configFile: FileWithPath,
    setConfigString: React.Dispatch<React.SetStateAction<string>>
}

export const FeatureColumn: React.FC<FeatureRowProps> = (props: FeatureRowProps) => {

    const [appState, setAppState] = useSharedState();

    const initialManualFeatures = [{ enabled: false, name: '', revision: 1, availableRevisions: [1] } as FeatureSelectorFeature]

    const [manualFeatures, setManualFeatures] = useState<FeatureSelectorFeature[]>(initialManualFeatures);

    const initialConfigFeatures = appState.repository.features.map(f => {
        let avail = f.revisions.sort((a, b) => Number(a.id) - Number(b.id)).map(r => parseInt(r.id))
        return { enabled: false, name: f.name, revision: Math.max(...avail), availableRevisions: [...avail, Math.max(...avail) + 1] } as FeatureSelectorFeature;
    })

    const [configFeatures, setConfigFeatures] = useState<FeatureSelectorFeature[]>(initialConfigFeatures);

    const reader = new FileReader();

    reader.onload = function (progressEvent) {

        var featuresFromConfig: FeatureSelectorFeature[] = [];
        var configText: string = progressEvent.target.result.toString();

        featuresFromConfig = configText.split(',').map(str => {

            str = str.replace(' ', '');
            var nameversion = str.replace('-', '').split('.');

            var feature: FeatureSelectorFeature = {
                enabled: !str.startsWith('-'),
                name: nameversion[0].toUpperCase(),
                revision: parseInt(nameversion[1]),
                availableRevisions: [1]
            }
            return feature;
        })

        let newManualFeatures = [...initialManualFeatures]
        let newConfigFeatures = [...initialConfigFeatures]

        featuresFromConfig.forEach(f => {
            let index = configFeatures.findIndex(cf => cf.name === f.name);
            if (index >= 0) {
                let index = configFeatures.findIndex(cf => cf.name === f.name)
                newConfigFeatures[index].enabled = f.enabled;
                newConfigFeatures[index].revision = f.revision;
            } else {
                newManualFeatures.unshift(f); // add manual feature
            }
        })

        setConfigFeatures(newConfigFeatures);
        setManualFeatures(newManualFeatures);
    };

    useEffect(() => {
        if (props.configFile) {
            reader.readAsText(props.configFile);
        } else {
            setConfigFeatures([...initialConfigFeatures]);
            setManualFeatures([...initialManualFeatures]);
        }
    }, [props.configFile]);

    return (
        <Row style={{ height: '40vh', overflowY: 'scroll', marginRight: '0px', position: 'relative' }}>
              <Col>
            <FeatureSelector features={configFeatures} manualFeatures={manualFeatures} onChange={(enabled, disabled) => props.setConfigString(enabled)} ></FeatureSelector>
              </Col>
        </Row>
    )
};