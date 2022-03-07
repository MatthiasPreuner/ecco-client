import * as React from "react";
import { useSharedState } from "../../../states/AppState";
import { useEffect, useState } from "react";

import { CommunicationService } from "../../../services/CommunicationService";
import { FeatureResponse } from "../../../model/FeatureResponse";
import { CommitModel } from "../../../model/CommitModel";

import { Container, Col, Row, InputGroup, Form, Table, Button, ListGroup, Card } from 'react-bootstrap';
import { MakeCommit } from "./Commits.MakeCommitModal";

export const Commits: React.FC = () => {

    const [appState, setAppState] = useSharedState();
    const [selectedCommit, setSelectedCommit] = useState<CommitModel>(null);

    /*     useEffect(() => {
            CommunicationService.getInstance().getFeatures().then((apiData: FeatureResponse) => {
                setAppState((previousState) => ({
                    ...previousState,
                    features: apiData.data
                }));
            });
        }, []); */

    function printDate(date: Date): string {
        return [date.getDay(), date.getMonth(), date.getFullYear()].join('.') + ' ' +
            [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');;
    }


    return (
        <Container className="main d-flex pt-4 justify-content-center">
            <Col>
                <Row>
                    <Col xs={8}><h3>Commits</h3></Col>
                    <Col xs={2}><Button className="w-100">Compare</Button></Col>
                    <Col xs={2}><MakeCommit /></Col>
                </Row>
                <Table hover size='sm' className="table-fixed table-responsive">
                    <thead>
                        <tr>
                            <th style={{ width: '400px' }}>Commit Message</th>
                            <th >Commiter</th>
                            <th >Date</th>
                        </tr>
                    </thead>
                    <tbody className="scrollable">
                        {appState.repository.commits.map((commit, i) => {
                            return (
                                <tr onClick={() => setSelectedCommit(commit)} className={selectedCommit == commit ? "btn-primary" : null} key={i}>
                                    <td style={{ width: '400px' }}>{commit.commitMessage}</td> {/* TODO max string length */}
                                    <td >{commit.username}</td>
                                    <td>{commit.date}</td>

                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                <Row>
                    {selectedCommit != null &&
                        <>
                            <Col xs={3} className="mr-auto mb-3">
                                <h4>Configuration</h4>
                                <Card style={{ width: '18rem' }}>
                                    <ListGroup variant="flush">
                                        {selectedCommit.configuration.featureRevisions.map((rev, i) => {
                                            return (
                                                <ListGroup.Item key={i}>{rev.featureRevisionString}</ListGroup.Item>
                                            )
                                        })}
                                    </ListGroup>
                                </Card>
                            </Col>
                            <Col xs={3} className="mr-auto mb-3">
                                <h4>Associations</h4>
                            </Col>
                            <Col xs={3} className="mr-auto mb-3">
                                <h4>Details View</h4>
                            </Col>
                            <Col xs={3} className="mr-auto mb-3">
                                <h4>Image?</h4>
                            </Col>
                        </>
                    }
                </Row>
            </Col >
        </Container >
    )
}
