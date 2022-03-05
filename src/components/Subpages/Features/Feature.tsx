import * as React from "react";
import { useSharedState } from "../../../states/AppState";
import { useEffect } from "react";
import { CommunicationService } from "../../../services/CommunicationService";
import { FeatureResponse } from "../../../model/FeatureResponse";
import { FeatureList } from "./Feature.List";
/* import { RevisionPerFeature } from "../../../old/Charts/Home.RevisionPerFeature"; */

import { Container, Col } from 'react-bootstrap';

export const Feature : React.FC = () => {

    const [appState, setAppState] = useSharedState();
    useEffect(() => {
        CommunicationService.getInstance().getFeatures().then((apiData: FeatureResponse) => {
            setAppState((previousState) => ({
                ...previousState,
                features: apiData.data
            }));
        });
    }, []);

    return (
        <Container className="main d-flex pt-4 justify-content-center">
            <Col>
                <FeatureList />
       {/*          <RevisionPerFeature /> */}
            </Col>
        </Container>
    )
}
