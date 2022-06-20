import * as React from "react";
import { useState } from "react";

import { Col, Button, Modal, Table, Tooltip, OverlayTrigger, Badge } from 'react-bootstrap';

import { CommitModel } from "../../../model/CommitModel";

export interface CommitFeature {
  enabled: boolean,
  name: string,
  revision: number,
}

export const CompareCommits: React.FC<{ commits: CommitModel[] }> = (props) => {

  const [show, setShow] = useState(false);

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
    // props.commits.sort((a,b) => a.date-b.date) needs date comparision
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

  let parseCondition = (condition: string) => {
    console.log(condition.replaceAll("!", '¬'))
    return condition.replaceAll('d^0', '').split(' AND ').map(subcondstr => {

      let m = new Map<string, number[]>();
      subcondstr.split(',').forEach(str => {

        let split = str.replace(/[[\]()]/g, '').split('.')

        let f = split[0];
        let r = parseInt(split[1]);

        if (m.has(f)) {
          m.get(f).push(r)
        } else {
          m.set(f, [r])
        }
      })
      return m
    })
  }

  let parseCondition2 = (condition: string): string => {
    return condition.replaceAll("!", '¬')
      .replaceAll("AND", '<b>&</b>')
      .replaceAll("OR", '<b>|</b>')
      .replaceAll(",d", '</sup>, d')
      .replaceAll("]", '</sup>]')
      .replaceAll('^', '<sup>')
  }

  return (
    <>
      <OverlayTrigger
        placement="left"
        delay={{ show: 250, hide: 400 }}
        overlay={<Tooltip id="tooltip-disabled">Hold CTRL to select 2 Commits</Tooltip>}
      >
        <span className="d-inline-block" style={{ padding: '0px' }}>
          <Button className="w-100" onClick={handleShow} disabled={props.commits[1] === null}>Compare</Button>
        </span>
      </OverlayTrigger>

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
                <tr>
                  <td>Condition</td>
                  <td style={{ textAlign: "center" }}>{props.commits[0].commitMessage}</td>
                  <td style={{ textAlign: "center" }}>{props.commits[1].commitMessage}</td>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((r, i) => {
                  return (
                    <tr key={i}>
                      <td dangerouslySetInnerHTML={{ __html: parseCondition2(r.condition) }} />
                    {/*   <td>


                        <div className="d-flex flex-wrap px-0" style={{ minHeight: '46px' }}>
                          {parseCondition(r.condition).map((map, idx) =>
                            <>
                              {Array.from(map).map((map, idx) =>
                                <div key={idx} className="association-container" >
                                  {map[0]} {map[1].sort((a, b) => a - b).map(v => <Badge className="association-badge">{v}</Badge>)}
                                </div>
                              )}
                            </>
                          )}  
                        </div>
                      </td> */}
                      <td style={{ textAlign: "center" }}>{r.c0 && <i className="bi bi-check-lg"></i>}</td>
                      <td style={{ textAlign: "center" }}>{r.c1 && <i className="bi bi-check-lg"></i>}</td>
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