import * as React from "react";
import { useSharedState } from "../../../states/AppState";
import { useEffect } from "react";
import { CommunicationService } from "../../../services/CommunicationService";
import { FeatureResponse } from "../../../model/FeatureResponse";

import { Container, Col, Row, InputGroup, Form, Table, Button, ListGroup, Card } from 'react-bootstrap';

export const Variants: React.FC = () => {

    const [appState, setAppState] = useSharedState();
    useEffect(() => {
      /*   CommunicationService.getInstance().getFeatures().then((apiData: FeatureResponse) => {
            setAppState((previousState) => ({
                ...previousState,
                features: apiData.data
            }));
        }); */
    }, []);

    return (
        <Container className="main d-flex pt-4 justify-content-center">
            <Col>
                <Row>
                    <Col xs={8}><h3>Variants</h3></Col>
                    <Col xs={2}><Button className="w-100">Add new Variant</Button></Col>
                    <Col xs={2}><Button className="w-100">Checkout</Button></Col>
                </Row>
                <Table hover size='sm' className="table-fixed table-responsive">
                    <thead>
                        <tr>
                            <th>Commit Message</th>
                            <th>Commiter</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appState.repository.commits.map((commit, i) => {
                            return (
                                <tr key={i}>
                                    <td width="500px">{commit.commitMessage}</td>
                                    <td>{commit.username}</td>
                                    <td>{commit.date}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                <Row>
                    <Col xs={3} className="mr-auto mb-3">
                        <h4>Configuration</h4>
                        <Card style={{ width: '18rem' }}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>Cras justo odio</ListGroup.Item>
                            <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                            <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                        </ListGroup>
                    </Card>
            </Col>
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
            <Col xs={3} className="mr-auto mb-3">
                <h4>Details View</h4>
            </Col>
            <Col xs={3} className="mr-auto mb-3">
                <h4>Image?</h4>
            </Col>
        </Row>


                {/*      <Row className="my-4">
                    <h3>New Commit</h3>
                    <MyDropzone />
                </Row> */}


            </Col >
        </Container >
    )
}
