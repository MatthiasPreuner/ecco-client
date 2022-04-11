import * as React from "react";
import { useSharedState } from "../../../states/AppState";

import { useDropzone, FileWithPath } from 'react-dropzone'
import { useCallback, useState, useEffect } from "react";
import { CommunicationService } from "../../../services/CommunicationService";

import { Col, Row, Form, Button, Modal, InputGroup } from 'react-bootstrap';
import { RepositoryResponse } from "../../../model/RepositoryResponse";
import { FeatureRow } from "./Commits.MakeCommitModal.FeatureRow";

export interface CommitFeature {
  enabled: boolean,
  name: string,
  revision: number,
}

export const MakeCommit: React.FC = () => {

  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleClose = () => {
    setConfigFeatures(initialConfigFeatures);
    setManualFeatures(initialManualFeatures);
    setConfigFile(undefined);
    setCommitMessage('');
    setShow(false);
    setValidated(false);
  }
  const handleShow = () => setShow(true);

  let onModalDismiss = () => {
    handleClose();
  }

  const [appState, setAppState] = useSharedState();

  const [tmpAcceptedFiles, setTmpAcceptedFiles] = useState<Map<String, FileWithPath>>(new Map<String, FileWithPath>());
  const [configFile, setConfigFile] = useState<FileWithPath>(undefined);
  const [commitMessage, setCommitMessage] = useState<string>('');

  const reader = new FileReader();

  reader.onload = function (progressEvent) {

    var featuresFromConfig: CommitFeature[] = [];
    var configText: string = progressEvent.target.result.toString();

    featuresFromConfig = configText.split(',').map(str => {

      str = str.replace(' ', '');
      var nameversion = str.replace('-', '').split('.');

      var feature: CommitFeature = {
        enabled: !str.startsWith('-'),
        name: nameversion[0].toUpperCase(),
        revision: parseInt(nameversion[1]),
      }
      return feature;
    })

    let newManualFeatures = [...initialManualFeatures]
    let newConfigFeatures = [...initialConfigFeatures]

    featuresFromConfig.forEach(f => {
      let index = configFeatures.findIndex(cf => cf.name === f.name);
      if (index >= 0) {
        let index = configFeatures.findIndex(cf => cf.name === f.name)
        newConfigFeatures[index].enabled = f.enabled;
        newConfigFeatures[index].revision = f.revision;
      } else {
        newManualFeatures.unshift(f); // add manual feature

      }
    })

    setConfigFeatures(newConfigFeatures);
    setManualFeatures(newManualFeatures);
  };

  useEffect(() => {
    if (configFile)
      reader.readAsText(configFile);
  }, [configFile]);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    console.log(tmpAcceptedFiles)
    var allFiles = new Map(tmpAcceptedFiles)
    acceptedFiles.forEach(f => {
      if (f.name.endsWith(".config")) {
        setConfigFile(f);
      } else {
        allFiles.set(f.path, f);
      }
    })
    console.log("allFiles:")
    console.log(allFiles )
    setTmpAcceptedFiles(allFiles);
  }, []);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const initialManualFeatures = [{
    enabled: false,
    name: '',
    revision: 1,
  } as CommitFeature]

  const [manualFeatures, setManualFeatures] = useState<CommitFeature[]>(initialManualFeatures);

  const [configString, setConfigString] = useState<string>("");

  const initialConfigFeatures = appState.repository.features.map(f => {
    return {
      enabled: false,
      name: f.name,
      revision: 1
    } as CommitFeature;
  })

  const [configFeatures, setConfigFeatures] = useState<CommitFeature[]>(initialConfigFeatures);

  let handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();
 
    if (form.checkValidity() && tmpAcceptedFiles.size !== 0 && config.length !== 0) {
      CommunicationService.getInstance().makeCommit(commitMessage, config, Array.from(tmpAcceptedFiles.values())).
        then((apiData: RepositoryResponse) => {
          console.log(apiData.data);
          setAppState((previousState) => ({
            ...previousState,
            repository: apiData.data
          }));
        });
      handleClose();
    }
    setValidated(true);
  };

  /*   then((response: any) => {
        document.getElementById("zipfilesucessalert").classList.add("show");
    }).catch().finally(() => {
        setTimeout(() => {
            document.getElementById("zipfilesucessalert").classList.remove("show");
        }, 3000);
    });  */

  let config = configFeatures.filter(ft => ft.enabled).concat(manualFeatures.filter(ft => ft.name !== '')).map(ft => (ft.enabled ? '' : '-') + ft.name + '.' + ft.revision).join(', ')

  

  let removeFile = (file: FileWithPath) => {
    // TODO remove properly :D even necessary???
    /*  tmpAcceptedFiles.delete(file.path);
     setTmpAcceptedFiles(tmpAcceptedFiles); */
  }

  let removeAllFiles = () => {
    setTmpAcceptedFiles(new Map<string, File>());
  }

  let removeConfigFile = () => {
    setConfigFeatures(initialConfigFeatures);
    setManualFeatures(initialManualFeatures);
    setConfigFile(undefined);
  }

  let removeManualFeature = (i: number) => {
    var tmpManualFeatures = [...manualFeatures]
    tmpManualFeatures.splice(i, 1) // remove inplace
    setManualFeatures(tmpManualFeatures);
  }

  const files = Array.from(tmpAcceptedFiles.values()).map((file: FileWithPath) => (
    <li key={file.name} className='pb-1'>
      <Button onClick={() => removeFile(file)} variant={'danger'} size={'sm'}><i className="bi bi-x"></i></Button> {file.path.substring(file.path.substring(1).indexOf("/") + 2)} - {file.size} bytes
    </li>
  ));

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
           {/*    <div id={"zipfilesucessalert"} className="alert alert-success alert-dismissible ecco-alert fade" role="alert">
                The files are sucessfully committed into the Repository!
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div> */}
              <Row className="mb-3" {...getRootProps()} >
                <input {...getInputProps()} />
                <Col className={"mx-2 d-flex rounded align-items-center align-content-center justify-content-around drop-zone " + (isDragActive ? "drop-zone-active" : "")}                                     >
                  {
                    isDragActive ?
                      <p className="m-0">Drop the files here ...</p> :
                      <p className="m-0">Drag 'n' drop some files or folders here, or click to select files</p>
                  }
                </Col>
              </Row>
              <Row style={{ minHeight: "45vh" }}>
                <Col xs={6}>
                  <Row>
                    <Col xs={8}><h4 className="mb-0">Files</h4></Col>
                    <Col xs={4}>
                      {(tmpAcceptedFiles.size === 0) ?
                        <Button variant='light' style={{ width: '100%' }} size='sm' disabled>no Files selected</Button> :
                        <Button variant='danger' style={{ width: '100%' }} size='sm' onClick={removeAllFiles} disabled={tmpAcceptedFiles.size < 1}>Remove all files</Button>}
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Form.Group>
                      <Form.Control isInvalid={tmpAcceptedFiles.size === 0} isValid={tmpAcceptedFiles.size > 0} type="hidden" />
                      <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">At least one File needs to be selected!</Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Row>
                    <ul style={{ listStyleType: "none" }}>{files}</ul>
                  </Row>
                </Col>
                <Col xs={6}>
                  <Row>
                    <Col xs={8}><h4 className="mb-0">Features</h4></Col>
                    <Col xs={4}>
                      {(configFile == null) ?
                        <Button variant='light' style={{ width: '100%' }} size='sm' disabled>.config not found</Button> :
                        <Button variant='danger' style={{ width: '100%' }} size='sm' onClick={removeConfigFile} disabled={configFile == null}>Remove Config File</Button>}
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Form.Group>
                      <Form.Control isInvalid={config.length === 0} isValid={config.length > 0} type="hidden" />
                      <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">Please select at least one Feature</Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <FeatureRow configFile={configFile} setConfigString={setConfigString} />
                  <Row style={{ height: '40vh', overflowY: 'scroll', marginRight: '0px' }}>
                    <Col>
                      {configFeatures.map((ft, i) => (
                        <>
                          <Row>
                            <Col xs={10}>
                              <Form.Check
                                className='my-1'
                                id={i.toString()}
                                label={ft.name}
                                checked={ft.enabled}
                                isInvalid={config.length === 0}
                                isValid={config.length > 0}
                                formNoValidate // not working
                                onChange={event => {
                                  var newConfigFeatures = [...configFeatures]
                                  newConfigFeatures[i].enabled = !ft.enabled;
                                  setConfigFeatures(newConfigFeatures);
                                }}
                              />

                            </Col>
                            <Col xs={2} className="pe-1">
                              {ft.enabled &&
                                <input
                                  type='number'
                                  className='form-control no-validation form-control form-control-sm'
                                  min={1}
                                  max={999} // TODO current + 1 or skipping enabled?
                               /*    isInvalid={config.length === 0}
                                  isValid={config.length > 0}  */
                                  value={ft.revision}
                                  disabled={!ft.enabled}
                                  onChange={event => {
                                    var newConfigFeatures = [...configFeatures]
                                    newConfigFeatures[i].revision = parseInt(event.target.value);
                                    setConfigFeatures(newConfigFeatures);
                                  }}
                                />}
                            </Col>
                          </Row>
                        </>
                      ))}
                      {manualFeatures.map((ft, i) => (
                        <Row>
                          <Col xs={1}>
                            <input type="checkbox" id="new" className="form-check-input my-1"
                              disabled={ft.name === ''}
                              checked={ft.enabled}
                              onChange={event => {
                                var tmpManualFeatures = [...manualFeatures]
                                tmpManualFeatures[i].enabled = !ft.enabled;
                                setManualFeatures(tmpManualFeatures);
                              }}
                            /></Col>
                          <Col xs={9}>
                            <InputGroup>
                              <input placeholder="Feature Name" type="text" className="form-control no-validation form-control-sm" style={{ marginLeft: '-25px' }}
                                value={ft.name}
                                onChange={event => {
                                  var tmpManualFeatures = [...manualFeatures]
                                  // if it was empty before
                                  if (tmpManualFeatures[i].name === '') {
                                    tmpManualFeatures.push({ enabled: false, name: '', revision: 1 }) // add new empty
                                    tmpManualFeatures[i].enabled = true; // enable self
                                  }
                                  tmpManualFeatures[i].name = event.target.value.toLocaleUpperCase();
                                  // if it is empty now
                                  if (event.target.value === '') {
                                    tmpManualFeatures = tmpManualFeatures.filter(feature => feature.name !== '') // remove all empty
                                    tmpManualFeatures = [...tmpManualFeatures, { enabled: false, name: '', revision: 1 }] // add new empty
                                  }
                                  setManualFeatures(tmpManualFeatures);
                                }} />
                              {ft.name.length > 0 ? <Button size='sm' variant="outline-primary" onClick={() => removeManualFeature(i)}><i className="bi bi-x"></i></Button> : null}
                            </InputGroup>
                          </Col>
                          <Col xs={2} className="pe-1">
                            <input
                              type='number'
                              className='form-control form-control-sm'
                              value={ft.revision} // new features start with revision 1
                              disabled
                            />
                          </Col>
                        </Row>))}
                    </Col>
                  </Row>
                </Col>
              </Row >
              <Form.Group className="mb-1" key={3}>
                <Form.Label>Configuration</Form.Label>
                <Form.Control type="text" disabled value={config} readOnly />
              </Form.Group>
              <Form.Group>
                <Form.Control as="textarea" required rows={1} type="text" placeholder="Commit Message" value={commitMessage} onChange={e => setCommitMessage(e.target.value)} />
              </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Col className="d-flex justify-content-between align-items-center">
              <Button variant="secondary" onClick={onModalDismiss}>Close</Button>
              <Button variant="primary" type="submit">Commit</Button>
            </Col>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}