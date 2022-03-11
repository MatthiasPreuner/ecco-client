import * as React from "react";
import { useSharedState } from "../../../states/AppState";
import { useState } from "react";
import { CreateVariant } from "./Variants.CreateVariantModal";

import { Container, Col, Row, InputGroup, Table, Button, ListGroup, Card, DropdownButton, Dropdown, Badge, FormControl } from 'react-bootstrap';

import { VariantModel } from "../../../model/VariantModel";
import { DeleteVariantModal } from "./Variants.DeleteVariantModal";
import { FeatureModel } from "../../../model/FeatureModel";
import { RemoveFeatureModal } from "./Variants.Feature.RemoveFeatureModal";


export const Features: React.FC<{ variant: VariantModel }> = (props) => {

    const [appState, setAppState] = useSharedState();

    let addFeature = (name: FeatureModel) => {
        // TODO add feature to selectedVariant
        /*   setFeatureFilter([...featureFilter, name]); */
    }

    let addableFeatures = () => {

        if (props.variant === null) return [];
        console.log("recakc")
        return appState.repository.features.filter(f => props.variant.configuration.featureRevisions.find(r => r.featureRevisionString.includes(f.name)) === undefined);
    }

    let addable = addableFeatures();


    return (
        <Col xs={3} className="mr-auto mb-3">
            <Row>
                <Col xs={8}><h5>Features</h5></Col>
                <Col className="float-end">
                    <DropdownButton size="sm" className="float-end" disabled={addableFeatures.length == 0} title="+">
                        {addable.map((feature, i) =>
                            (<Dropdown.Item key={i} onClick={() => addFeature(feature)}>{feature.name}</Dropdown.Item>)
                        )}
                    </DropdownButton>
                </Col>
            </Row>

            <Card>
                <ListGroup variant="flush" className='mb-0' style={{maxHeight: '200px'}}>
                    {props.variant.configuration.featureRevisions.map((rev, i) => {
                        return (
                            <ListGroup.Item key={i}>{rev.featureRevisionString.split('.')[0]}
                                <div className="float-end">
                                    <Badge bg="primary" className='btn' pill>{rev.featureRevisionString.split('.')[1]} / 15<i className="bi bi-arrow-up-short"></i></Badge>

                                    <RemoveFeatureModal variant={props.variant} featureRevision={rev} />
                                </div>
                            </ListGroup.Item>
                        )
                    })}
                </ListGroup>
            </Card>
        </Col>
    )

}
