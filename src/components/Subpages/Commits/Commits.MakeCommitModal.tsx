import * as React from "react";
import { useSharedState } from "../../../states/AppState";

import { useDropzone, FileWithPath } from 'react-dropzone'
import { useCallback, useState } from "react";
import { CommunicationService } from "../../../services/CommunicationService";

import { Col, Row, Form, Button, Modal } from 'react-bootstrap';
import { RepositoryResponse } from "../../../model/RepositoryResponse";
import { FileTreeView, FileTreeViewRef } from "./Commits.MakeCommitModal.FileTreeView";
import { FeatureColumn } from "./Commits.MakeCommitModal.FeatureColumn";
import { AxiosError } from "axios";
import { LoadingButton } from "../../common/LoadingButton";

declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    // extends React's HTMLAttributes
    directory?: string;
    webkitdirectory?: string;
  }
}

export interface CommitFeature {
  enabled: boolean,
  name: string,
  revision: number,
  availablerevisions: number[]
}

export const MakeCommit: React.FC = () => {

  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleClose = () => {
    setConfigFile(null);
    setCommitMessage('');
    setShow(false);
    setValidated(false);
    setChoosenFiles(null);
    setIsCommiting(false)
    removeAllFiles();
  }
  const handleShow = () => setShow(true);

  let onModalDismiss = () => {
    handleClose();
  }

  const [appState, setAppState] = useSharedState();

  const [tmpAcceptedFiles, setTmpAcceptedFiles] = useState<Map<String, FileWithPath>>(new Map<String, FileWithPath>()); // as Map to prevent duplicates, old files will be overwritten
  const [configFile, setConfigFile] = useState<FileWithPath>(null);
  const [commitMessage, setCommitMessage] = useState<string>('');
  const [choosenFiles, setChoosenFiles] = useState<Array<FileWithPath>>(new Array<FileWithPath>());
  const [isCommiting, setIsCommiting] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    var allFiles = new Map(tmpAcceptedFiles)

    if (acceptedFiles.filter(f => f.name === f.path).length > 0) {
      console.log("please select a folder")
    } else {

      acceptedFiles.forEach(f => {
        if (f.name.endsWith(".config")) {
          setConfigFile(f);
        } else {
          allFiles.set(f.path, f);
        }
      })
    }
    setTmpAcceptedFiles(allFiles);
  }, []);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const [configString, setConfigString] = useState<string>("");

  let handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity() && tmpAcceptedFiles.size !== 0 && configString.length !== 0) {
      setIsCommiting(true)
      CommunicationService.getInstance().makeCommit(appState.repository, commitMessage, configString, choosenFiles).
        then((apiData: RepositoryResponse) => {
          setAppState((previousState) => ({ ...previousState, repository: apiData.data }));
          setIsCommiting(false);
          handleClose();
        }, (e: AxiosError) => { console.log("error"); setIsCommiting(false); });
    }
    setValidated(true);
  };

  let removeAllFiles = () => { setTmpAcceptedFiles(new Map<string, File>()); }

  const treeViewRef = React.useRef<FileTreeViewRef>(null)

  return (
    <>
      <Button variant="primary" className="w-100" onClick={handleShow}>New Commit</Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size='xl'
        className="no-user-select"
      >
        <Modal.Header closeButton>
          <Modal.Title>New Commit</Modal.Title>
        </Modal.Header>
        <Form validated={validated} onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="mb-3" {...getRootProps()} >
              <input {...getInputProps()} directory="" webkitdirectory="" />
              <Col className={"mx-2 d-flex rounded align-items-center align-content-center justify-content-around drop-zone " + (isDragActive ? "drop-zone-active" : "")}                                     >
                {
                  isDragActive ?
                    <p className="m-0">Drop the folder here ... it can't be a file</p> :
                    <p className="m-0">Drag 'n' drop a folder here, or click to select a folder</p>
                }
              </Col>
            </Row>
            <Row style={{ minHeight: "45vh" }}>
              <Col xs={6}>
                <Row className="mb-1">
                  <Col xs={8}><h4 className="mb-0">Files</h4></Col>
                  <Col xs={4}>
                    {(tmpAcceptedFiles.size === 0) ?
                      <Button variant='light' style={{ width: '100%' }} size='sm' disabled>no Files selected</Button> :
                      <Button variant='danger' style={{ width: '100%' }} size='sm' onClick={removeAllFiles} disabled={tmpAcceptedFiles.size < 1}>Remove all files</Button>}
                  </Col>
                </Row>
                <Row className="ps-0" >
                  <Col>
                    <Row key={0} className="feedback-row" style={{ position: 'sticky', top: '0', left: '0', backgroundColor: '#fff', zIndex: 5 }}>
                      {tmpAcceptedFiles.size > 0 ?
                        <>
                          <Col xs={9}>
                            <Form.Group>
                              <Form.Control isInvalid={choosenFiles?.length === 0} isValid={choosenFiles?.length > 0} type="hidden" />
                              <Form.Control.Feedback type="valid">{choosenFiles?.length} files selected.</Form.Control.Feedback>
                              <Form.Control.Feedback type="invalid">At least one File needs to be selected!</Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col className="rct-options rct-options-custom">
                            <button key={"b0"} onClick={() => treeViewRef.current.expandAll()} aria-label="Expand all" title="Expand all" type="button" className="rct-option rct-option-expand-all"><i className="bi bi-plus-square" /></button>
                            <button key={"b1"} onClick={() => treeViewRef.current.collapseAll()} aria-label="Collapse all" title="Collapse all" type="button" className="rct-option rct-option-collapse-all"><i className="bi bi-dash-square" /></button>
                          </Col>
                        </> :
                        <i>Please select a folder.</i>
                      }
                    </Row>
                    <Row style={{ height: '40vh', overflowY: 'scroll', overflowX: 'auto', marginRight: '0px', marginLeft: '0px', position: 'relative' }}>
                      <FileTreeView
                        files={tmpAcceptedFiles}
                        onChange={files => setChoosenFiles(files)}
                        ref={treeViewRef}
                      />
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col xs={6}>
                <Row className="mb-1">
                  <Col xs={8}><h4 className="mb-0">Features</h4></Col>
                  <Col xs={4}>
                    {(configFile === null) ?
                      <Button variant='light' style={{ width: '100%' }} size='sm' disabled>.config not found</Button> :
                      <Button variant='danger' style={{ width: '100%' }} size='sm' onClick={() => setConfigFile(null)} disabled={configFile === null}>Remove Config File</Button>}
                  </Col>
                </Row>
                <FeatureColumn configFile={configFile} setConfigString={setConfigString} />
              </Col>
            </Row >
            <Form.Group className="mb-1" key={3}>
              <Form.Label>Configuration</Form.Label>
              <Form.Control type="text" disabled value={configString} readOnly />
            </Form.Group>
            <Form.Group>
              <Form.Control as="textarea" required rows={1} type="text" placeholder="Commit Message" value={commitMessage} onChange={e => setCommitMessage(e.target.value)} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Col className="d-flex justify-content-between align-items-center">
              <Button variant="secondary" onClick={onModalDismiss}>Close</Button>
              <LoadingButton loading={isCommiting} variant="primary" type="submit">Commit</LoadingButton>
            </Col>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}