import * as React from "react";
import { useSharedState } from "../../../states/AppState";
import { useState, useEffect } from "react";

import { Col, Row, ListGroup, Card, Dropdown, Badge, Stack } from 'react-bootstrap';

import { VariantModel } from "../../../model/VariantModel";
import { FeatureModel } from "../../../model/FeatureModel";
import { CommunicationService } from "../../../services/CommunicationService";
import { RepositoryResponse } from "../../../model/RepositoryResponse";
import { FeatureRevisionModel } from "../../../model/FeatureRevisionModel";


export const Features: React.FC<{ variant: VariantModel }> = (props) => {

    const [appState, setAppState] = useSharedState();

    let variantAddFeature = (variant: VariantModel, feature: FeatureModel) => {
        CommunicationService.getInstance().variantAddFeature(variant, feature)
            .then((apiData: RepositoryResponse) => {
                setAppState((previousState) => ({
                    ...previousState,
                    repository: apiData.data
                }));

            });
    }

    let variantRemoveFeature = (featureRevision: FeatureRevisionModel) => {
        CommunicationService.getInstance().variantRemoveFeature(props.variant, featureRevision.featureRevisionString.split('.')[0])
            .then((apiData: RepositoryResponse) => {
                setAppState((previousState) => ({
                    ...previousState,
                    repository: apiData.data
                }));
            });
    }

    let variantUpdateFeature = (variant: VariantModel, featureName: string, revision: string) => {
        CommunicationService.getInstance().variantUpdateFeature(variant, featureName, revision)
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

    /*   $('.dropdown').on('show.bs.dropdown', function() {
          $('body').append($('.dropdown').css({
            position: 'absolute',
            left: $('.dropdown').offset().left,
            top: $('.dropdown').offset().top
          }).detach());
        });
   */

    return (
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
                <ListGroup variant="flush" className='mb-0' style={{ maxHeight: '200px' }}>
                    {props.variant.configuration.featureRevisions.sort((a, b) => a.featureRevisionString.localeCompare(b.featureRevisionString)).map((rev, i) => {

                        let possibleFeatureRevisions = appState.repository.features.find(f => f.name === rev.featureRevisionString.split('.')[0]).revisions
                            .filter(r => r.id !== rev.id).sort((a, b) => Number(a.id) - Number(b.id));

                        return (
                            <ListGroup.Item key={i}>{rev.featureRevisionString.split('.')[0]}
                                <Stack gap={1} direction="horizontal" className="float-end ">
                                    <Dropdown>
                                        <Dropdown.Toggle disabled={possibleFeatureRevisions.length < 1} variant="primary" bsPrefix="btn ms-1 badge bg-primary">
                                            {rev.featureRevisionString.split('.')[1]}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            {possibleFeatureRevisions.map((revision, i) =>
                                                (<Dropdown.Item key={i} onClick={() => variantUpdateFeature(props.variant, revision.featureRevisionString.split('.')[0], revision.id)}>{revision.id}</Dropdown.Item>)
                                            )}
                                        </Dropdown.Menu>
                                    </Dropdown>

                                    < div >
                                        <Badge bg="primary" className='btn' onClick={() => variantRemoveFeature(rev)}><i className="bi bi-x-lg"></i></Badge>
                                    </div>
                                </Stack>
                            </ListGroup.Item>
                        )
                    })}
                </ListGroup >
            </Card >
        </Col >
    )

}
