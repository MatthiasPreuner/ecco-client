import * as React from "react";
import { useSharedState } from "../../../states/AppState";
import { useState } from "react";

import { CommitModel } from "../../../model/CommitModel";
import { Container, Col, Row, Table, Button, ListGroup, Card, Badge } from 'react-bootstrap';
import { MakeCommit } from "./Commits.MakeCommitModal";

export const Commits: React.FC = () => {

    const [appState, setAppState] = useSharedState();
    const [compareCommit, setCompareCommit] = useState<CommitModel>(null);
    const [selectedCommit, setSelectedCommit] = useState<CommitModel>(null);

    function printDate(date: Date): string {
        return [date.getDay(), date.getMonth(), date.getFullYear()].join('.') + ' ' +
            [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');;
    }

    let selectCommit = (event: React.MouseEvent, commit: CommitModel) => {
        setCompareCommit(event.ctrlKey ? selectedCommit : null);
        setSelectedCommit(commit);
    }

    return (
        <Container className="main d-flex pt-4 justify-content-center">
            <Col>
                <Row><h3>Commits</h3></Row>
                <Row>
                    <Col xs={10}>
                        <Table hover size='sm' className="table-fixed table-responsive">
                            <thead>
                                <tr>
                                    <th style={{ width: '400px' }}>Commit Message</th>
                                    <th style={{ width: '200px' }}>Commiter</th>
                                    <th style={{ width: '200px' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody className="scrollable">
                                {appState.repository.commits.map((commit, i) => {
                                    return (
                                        <tr onClick={(e) => selectCommit(e, commit)} className={selectedCommit === commit ? "btn-primary" : null} key={i}>
                                            <td style={{ width: '400px' }}>{commit.commitMessage}</td> {/* TODO max string length */}
                                            <td style={{ width: '200px' }}>{commit.username}</td>
                                            <td style={{ width: '200px' }}>{commit.date}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Col>
                    <Col>
                        <Row className='mb-2'><Button className="w-100" disabled={compareCommit === null}>Compare</Button></Row>
                        <Row className='mb-2'><MakeCommit /></Row>
                    </Col>
                </Row>
                <Row>
                    {selectedCommit != null &&
                        <>
                            <Col xs={3} className="mr-auto mb-3">
                                <h5>Configuration</h5>
                                <Card>
                                    <ListGroup variant="flush" className='mb-0' style={{ maxHeight: '30vh' }}>
                                        {selectedCommit.configuration.featureRevisions.map((rev, i) => {
                                            return (
                                                <ListGroup.Item key={i}>{rev.featureRevisionString.split('.')[0]}
                                                    <Badge className="float-end" bg="primary">{rev.featureRevisionString.split('.')[1]}</Badge>
                                                </ListGroup.Item>
                                            )
                                        })}
                                    </ListGroup>
                                </Card>
                            </Col>
                            <Col xs={3} className="mr-auto mb-3">
                                <h5>Associations</h5>
                            </Col>
                            <Col xs={3} className="mr-auto mb-3">
                                <h5>Details View</h5>
                            </Col>
                            <Col xs={3} className="mr-auto mb-3">
                                <h5>Image?</h5>
                            </Col>
                        </>
                    }
                </Row>
            </Col >
        </Container >
    )
}
