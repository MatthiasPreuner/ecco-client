import * as React from "react";
import { useSharedState } from "../../../states/AppState";
import { useState } from "react";

import { Col, Row, Form, Button, Modal, InputGroup, Table } from 'react-bootstrap';

import { CommitModel } from "../../../model/CommitModel";
import { Commits } from "./Commits";

export interface CommitFeature {
  enabled: boolean,
  name: string,
  revision: number,
}

export const CompareCommits: React.FC<{ commits: CommitModel[] }> = (props) => {

  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleClose = () => {
    setShow(false);
  }
  const handleShow = () => setShow(true);

  interface CompareRow {
    id: string,
    condition: string,
    c0: boolean,
    c1: boolean,
  }

  const compare = () => {

    let result: CompareRow[] = [];

    props.commits[0]?.associations.forEach(a => {
      if (props.commits[1]?.associations.find(b => b.id === a.id)) {
        result.push({ id: a.id, condition: a.simpleModuleRevisionCondition, c0: true, c1: true })
      } else {
        result.push({ id: a.id, condition: a.simpleModuleRevisionCondition, c0: true, c1: false })
      }
    })

    props.commits[1]?.associations.forEach(b => {
      if (!props.commits[0]?.associations.find(a => a.id === b.id)) {
        result.push({ id: b.id, condition: b.simpleModuleRevisionCondition, c0: false, c1: true })
      }
    })

    return result;
  }

  const compareRows = compare();


  const [appState, setAppState] = useSharedState();

  return (
    <>
      <Button className="w-100" onClick={handleShow} disabled={props.commits[1] === null} >Compare</Button>


      {props.commits[1] !== null &&
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          size='xl'
          className="no-user-select"
        >
          <Modal.Header closeButton>
            <Modal.Title>Compare Commits</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table size="sm">
              <thead>
             {/*    <tr>
                  <td></td>
                  <td>Commit:</td>
                  <td>Commit:</td>
                </tr> */}
                <tr>
                  <td>Condition</td>
                  <td>{props.commits[0].commitMessage}</td>
                  <td>{props.commits[1].commitMessage}</td>
                </tr>
              </thead>
              <tbody>

                {compareRows.map((r, i) => {
                  return (
                    <tr key={i}>
                      <td>{r.condition}</td>
                      <td style={{ textAlign: "center" }}>{r.c0 && <i className="bi bi-check"></i>}</td>
                      <td style={{ textAlign: "center" }}>{r.c1 && <i className="bi bi-check"></i>}</td>
                    </tr>
                  )
                })}

              </tbody>



            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Col className="d-flex align-items-end flex-column">
              <Button variant="primary" onClick={handleClose}>Close</Button>
            </Col>
          </Modal.Footer>

        </Modal>
      }
    </>
  );
}