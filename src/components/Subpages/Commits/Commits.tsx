import * as React from "react";
import { useSharedState } from "../../../states/AppState";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import { CommitModel } from "../../../model/CommitModel";
import { Container, Col, Row, Table, Button, ListGroup, Card, Badge } from 'react-bootstrap';
import { MakeCommit } from "./Commits.MakeCommitModal";
import { CompareCommits } from "./Commits.CompareCommitsModal";

import './Commits.scss';
import { TableInfoRow } from "../../common/TableInfoRow";

export const Commits: React.FC = () => {

    const [appState, setAppState] = useSharedState();
    const [compareCommit, setCompareCommit] = useState<CommitModel>(null);
    const [selectedCommit, setSelectedCommit] = useState<CommitModel>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!appState.userIsLoggedIn || appState.repository === null) {
            navigate(`/`)
        }
    }, []);

    function printDate(date: Date): string {
        return [date.getDay(), date.getMonth(), date.getFullYear()].join('.') + ' ' +
            [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');;
    }

    let selectCommit = (event: React.MouseEvent, commit: CommitModel) => {
        setCompareCommit(event.ctrlKey && commit !== selectedCommit ? selectedCommit : null);
        setSelectedCommit(commit);
    }

    let infoMessage: string = appState.repository?.features.length === 0 ? "Repository has no Commits yet." : "";

    return (
        <Container className="main d-flex pt-4 justify-content-center">
            <Col>
                <Row><h3>Commits</h3></Row>
                <Row>
                    <Col xs={10}>
                        <Table hover size='sm' className="table-fixed table-responsive">
                            <thead>
                                <tr>
                                    <th style={{ minWidth: '70%' }}>Commit Message</th>
                                    <th style={{ minWidth: '15%' }}>Commiter</th>
                                    <th style={{ minWidth: '15%' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody style={{ height: "40vh" }}>
                                {appState.repository?.commits.map((commit, i) => {
                                    return (
                                        <tr onClick={(e) => selectCommit(e, commit)} className={selectedCommit === commit || compareCommit === commit ? "btn-primary" : null} key={i}>
                                            <td style={{ minWidth: '70%' }}>{commit.commitMessage}</td> {/* TODO max string length */}
                                            <td style={{ minWidth: '15%' }}>{commit.username}</td>
                                            <td style={{ minWidth: '15%' }}>{commit.date}</td>
                                        </tr>
                                    )
                                })}
                                <TableInfoRow message={infoMessage} />
                            </tbody>
                        </Table>
                    </Col>
                    <Col>
                        <Row className='mb-2'><CompareCommits commits={[selectedCommit, compareCommit]} /></Row>
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
                                                <ListGroup.Item key={i}>{rev.featureName}
                                                    <Badge className="float-end" bg="primary">{rev.featureRevisionIndex}</Badge>
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
