import * as React from "react";
import { useSharedState } from "../../../states/AppState";
import { Col, Row, ListGroup, Card, Dropdown, Stack, Button } from 'react-bootstrap';

import { VariantModel } from "../../../model/VariantModel";
import { FeatureModel } from "../../../model/FeatureModel";
import { CommunicationService } from "../../../services/CommunicationService";
import { RepositoryResponse } from "../../../model/RepositoryResponse";
import { FeatureRevisionModel } from "../../../model/FeatureRevisionModel";
import { SpinButtonGroup } from "../../common/SpinButtonGroup";


export const Features: React.FC<{ variant: VariantModel }> = (props) => {

    const [appState, setAppState] = useSharedState();

    let variantAddFeature = (variant: VariantModel, feature: FeatureModel) => {
        CommunicationService.getInstance().variantAddFeature(appState.repository, variant, feature)
            .then((apiData: RepositoryResponse) => {
                setAppState((previousState) => ({
                    ...previousState,
                    repository: apiData.data
                }));
            });
    }

    let variantRemoveFeature = (featureRevision: FeatureRevisionModel) => {
        CommunicationService.getInstance().variantRemoveFeature(appState.repository, props.variant, featureRevision.featureName)
            .then((apiData: RepositoryResponse) => {
                setAppState((previousState) => ({
                    ...previousState,
                    repository: apiData.data
                }));
            });
    }

    let variantUpdateFeature = (variant: VariantModel, featureName: string, revision: string) => {
        console.log("update")
        CommunicationService.getInstance().variantUpdateFeature(appState.repository, variant, featureName, revision)
            .then((apiData: RepositoryResponse) => {
                setAppState((previousState) => ({
                    ...previousState,
                    repository: apiData.data
                }));
            });
    }

    let addableFeatures = () => {
        if (props.variant == null) return [];
        let f = appState.repository.features
            .filter(f => props.variant.configuration.featureRevisions
                .find(r => r.featureRevisionString
                    .includes(f.name)) === undefined);
        return f
    }
    let AddableFeatures = addableFeatures();





    return (
        <>
            <Col xs={3} className="mr-auto mb-3">
                <Row>
                    <Col xs={8}><h5>Features</h5></Col>
                    <Col className="float-end">
                        <Dropdown>
                            <Dropdown.Toggle disabled={AddableFeatures.length < 1} variant="primary" bsPrefix="btn ms-1 badge bg-primary float-end">
                                <i className="bi bi-plus-lg"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {AddableFeatures.map((feature, i) =>
                                    (<Dropdown.Item key={i} onClick={() => variantAddFeature(props.variant, feature)}>{feature.name}</Dropdown.Item>)
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
                <Card>
                    <ListGroup variant="flush"
                        className='mb-0'
                        style={{maxHeight: '30vh'}}
                    >
                        {props.variant.configuration.featureRevisions
                            .sort((a, b) => a.featureRevisionString.localeCompare(b.featureRevisionString))
                            .map((rev, i) => {

                                let possibleFeatureRevisions = appState.repository?.features?.find(f => f.name === rev.featureName).revisions
                                    .sort((a, b) => Number(a.id) - Number(b.id));

                                let currentIndex = possibleFeatureRevisions?.map(r => r.featureRevisionString).indexOf(rev.featureRevisionString);

                                return (
                                    <ListGroup.Item key={i} className="pe-1">{rev.featureName}
                                        <Stack gap={1} direction="horizontal" className="float-end ">
                                            <SpinButtonGroup
                                                style={{width: '80px'}}
                                                value={rev.id}
                                                min={possibleFeatureRevisions[0]?.id}
                                                max={possibleFeatureRevisions[possibleFeatureRevisions.length - 1]?.id}
                                                onChange={(value) => variantUpdateFeature(props.variant, rev.featureName, possibleFeatureRevisions[currentIndex + value].id)}
                                            />
                                            <Button size='sm' onClick={() => variantRemoveFeature(rev)}><i className="bi bi-x-lg" /></Button>
                                        </Stack>
                                    </ListGroup.Item>
                                )
                            })}
                    </ListGroup >
                </Card >
            </Col >
        </>
    )
}
