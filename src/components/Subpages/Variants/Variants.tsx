import * as React from "react";
import { useSharedState } from "../../../states/AppState";
import { useState, useEffect } from "react";
import { CommunicationService } from "../../../services/CommunicationService";
import { FeatureResponse } from "../../../model/FeatureResponse";
import { CreateVariant } from "./Variants.CreateVariantModal";

import { Container, Col, Row, InputGroup, Form, Table, Button, ListGroup, Card, ButtonGroup, Badge } from 'react-bootstrap';
import { VariantModel } from "../../../model/VariantModel";


export const Variants: React.FC = () => {

    const [appState, setAppState] = useSharedState();
    const [selectedVariant, setSelectedVariant] = useState<VariantModel>(null);
    useEffect(() => {
        /*   CommunicationService.getInstance().getFeatures().then((apiData: FeatureResponse) => {
              setAppState((previousState) => ({
                  ...previousState,
                  features: apiData.data
              }));
          }); */
    }, []);

    let addFeature = () => {
        /*   CommunicationService.getInstance().getDefaultRepo().then((apiData: RepositoryResponse) => {
              setAppState((previousState) => ({
                  ...previousState,
                  repository: apiData.data
              }));
              console.log(apiData.data);
          }); */
    }

    return (
        <Container className="main d-flex pt-4 justify-content-center">
            <Col>
                <Row>
                    <Col xs={8}><h3>Variants</h3></Col>

                    <Col xs={2}><CreateVariant /></Col>
                    <Col xs={2}><Button className="w-100">Remove Variant</Button></Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        <Table hover size='sm' className="table-fixed table-responsive">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Configuration??</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appState.repository.variants.map((variant, i) => {
                                    return (
                                        <tr onClick={() => setSelectedVariant(variant)} className={selectedVariant == variant ? "btn-primary" : null} key={i}>
                                            <td width="500px">TODO {variant.name}</td>
                                            <td>{variant.description}</td>
                                            <td>{variant.name}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Col>
                    <Col xs={6}>


                        
                    </Col>
                </Row>
                {selectedVariant != null &&
                    <>

                        <Row>
                            <Col xs={3} className="mr-auto mb-3">
                                <Row>
                                    <Col xs={8}><h4>Features</h4></Col>
                                    <Col className="float-end"><Button><i className="bi bi-plus-circle"></i></Button></Col>
                                </Row>

                                <Card style={{ width: '18rem' }}>
                                    <ListGroup variant="flush">
                                        {selectedVariant.configuration.featureRevisions.map((rev, i) => {
                                            return (
                                                <ListGroup.Item key={i}>{rev.featureRevisionString}
                                                    <div className="float-end">
                                                        <Badge bg="primary" pill>14 / 15<i className="bi bi-arrow-up-short"></i></Badge>
                                                        <Badge bg="primary" pill><i className="bi bi-x-lg"></i></Badge>
                                                    </div>
                                                </ListGroup.Item>
                                            )
                                        })}
                                    </ListGroup>
                                </Card>
                            </Col>
                            {/*                         <Col xs={2}><Button className="w-100">Filter by Feature Revisions</Button></Col>


                        <Col xs={2}><Button className="w-100">Checkout Variant</Button></Col> */}


                            <Col xs={3} className="mr-auto mb-3">
                                <h4>Associations</h4>
                                {/*                         <InputGroup className="mb-3">
                        <InputGroup.Text><i className="bi bi-funnel-fill"></i></InputGroup.Text>
                            <FormControl
                                placeholder="Featurename for filtering..."
                                onChange={setNewInputValue}
                                value={featureFilterText}
                            />
                            {featureFilterText.length > 0 ? <Button variant="outline-primary" onClick={() => setFeatureFilterText("")}><i className="bi bi-x"></i></Button> : null}
                        </InputGroup> */}
                            </Col>
                            {/*     <Col xs={3} className="mr-auto mb-3">
                            <h4>Details View</h4>
                        </Col>
                        <Col xs={3} className="mr-auto mb-3">
                            <h4>Image?</h4>
                        </Col> */}
                        </Row>
                        <Row className="my-4 float-end"><Button className="w-100">Checkout Variant</Button>
                        </Row>
                    </>
                }


            </Col >
        </Container >
    )
}
