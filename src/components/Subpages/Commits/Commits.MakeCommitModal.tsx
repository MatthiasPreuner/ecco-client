import * as React from "react";
import { useSharedState } from "../../../states/AppState";

import { useDropzone, FileWithPath } from 'react-dropzone'
import { useCallback, useState } from "react";
import { CommunicationService } from "../../../services/CommunicationService";

import { Col, Row, Form, Button, Modal } from 'react-bootstrap';
import { RepositoryResponse } from "../../../model/RepositoryResponse";

export interface CommitFeature {
  enabled: boolean,
  name: string,
  revision: number,
}

export const MakeCommit: React.FC = () => {

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setCommitMessage('');
    setShow(false);
  }
  const handleShow = () => setShow(true);

  let onModalDismiss = () => {
    handleClose();
  }

  const [appState, setAppState] = useSharedState();

  const [tmpAcceptedFiles, setTmpAcceptedFiles] = useState<Map<String, FileWithPath>>(new Map<String, FileWithPath>());
  const [configFile, setConfigFile] = useState<FileWithPath>(undefined);
  const [commitMessage, setCommitMessage] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {

    var allFiles = new Map(tmpAcceptedFiles)
    acceptedFiles.forEach(f => {
      /*  path = f.path.substring(f.path.substring(1).indexOf("/")); */
      if (f.name.endsWith(".config")) {
        setConfigFile(f);
      } else {
        allFiles.set(f.path, f);
      }
    })
    setTmpAcceptedFiles(allFiles);

    // handle config file
    var CommitFeatures: CommitFeature[] = [];
    if (configFile !== undefined) {

      var reader = new FileReader();
      
      reader.onload = function (progressEvent) {
        console.log('File content:', progressEvent.target.result.toString());

        var configText: string = progressEvent.target.result.toString();

        CommitFeatures = configText.split(',').map(str => {

          str = str.replace(' ', '');
          var nameversion = str.replace('-', '').split('.');

          var feature: CommitFeature = {
            enabled: !str.startsWith('-'),
            name: nameversion[0],
            revision: parseInt(nameversion[1]),
          }
          return feature;
        })

        configFeatures.concat(CommitFeatures);
        setConfigFeatures(configFeatures);
      };
      reader.readAsText(configFile);

      console.log('Features: ' + CommitFeatures);
    }
  }, []);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const [manualFeatures, setManualFeatures] = useState<CommitFeature[]>([{
    enabled: false,
    name: '',
    revision: 1,
  } as CommitFeature]);

  const [configFeatures, setConfigFeatures] = useState<CommitFeature[]>(appState.repository.features.map(f => {
    return {
      enabled: false,
      name: f.name,
      revision: 1
    } as CommitFeature;
  }));


  let makeCommit = () => {
    console.log(tmpAcceptedFiles);
    console.log(commitMessage)
    CommunicationService.getInstance().makeCommit(commitMessage, config, Array.from(tmpAcceptedFiles.values())).
      then((apiData: RepositoryResponse) => {
        console.log(apiData.data);
        setAppState((previousState) => ({
          ...previousState,
          repository: apiData.data
        }));
      });
    handleClose();
  };

  /*   then((response: any) => {
        document.getElementById("zipfilesucessalert").classList.add("show");
    }).catch().finally(() => {
        setTimeout(() => {
            document.getElementById("zipfilesucessalert").classList.remove("show");
        }, 3000);
    });  */

  let config = configFeatures.filter(ft => ft.enabled).concat(manualFeatures.filter(ft => ft.name !== '')).map(ft => (ft.enabled ? '' : '-') + ft.name + '.' + ft.revision).join(', ')

  // TODO remove properly :D
  let removeFile = (file: FileWithPath) => {
    tmpAcceptedFiles.delete(file.path);
    /*   console.log(newFiles); */
    setTmpAcceptedFiles(tmpAcceptedFiles);
  }

  let removeAllFiles = () => {
    setTmpAcceptedFiles(new Map<string, File>());
  }

  let removeConfigFile = () => {
    setConfigFile(null);
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
        <Modal.Body>
          <Form>
            <>
              <div id={"zipfilesucessalert"} className="alert alert-success alert-dismissible ecco-alert fade" role="alert">
                The files are sucessfully committed into the Repository!
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
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
                    <Col xs={8}><h4>Files</h4></Col>
                    <Col xs={4}>
                      {(tmpAcceptedFiles.size < 1) ?
                        <Button variant='light' style={{ width: '100%' }} size='sm' disabled>no Files selected</Button> :
                        <Button variant='danger' style={{ width: '100%' }} size='sm' onClick={removeAllFiles} disabled={tmpAcceptedFiles.size < 1}>Remove all files</Button>}
                    </Col>
                  </Row>
                  <Row>
                    <ul style={{ listStyleType: "none" }}>{files}</ul>
                  </Row>
                </Col>
                <Col xs={6}>
                  <Row>
                    <Col xs={8}><h4>Features</h4></Col>
                    <Col xs={4}>
                      {(configFile == null) ?
                        <Button variant='light' style={{ width: '100%' }} size='sm' disabled>.config not found</Button> :
                        <Button variant='danger' style={{ width: '100%' }} size='sm' onClick={removeConfigFile} disabled={configFile == null}>Remove Config File</Button>}
                    </Col>
                  </Row>
                  <div className="mb-3">
                    {configFeatures.map((ft, i) => (
                      <>
                        {/*  <FeatureRow features={configFeatures} setConfigFeatures={setConfigFeatures} /> */}
                        <Row>
                          <Col xs={10}>
                            <Form.Check
                              className='my-1'
                              id={i.toString()}
                              label={ft.name}
                              checked={ft.enabled}
                              onChange={event => {
                                var newConfigFeatures = [...configFeatures]
                                newConfigFeatures[i].enabled = !ft.enabled;
                                setConfigFeatures(newConfigFeatures);
                              }}
                            />
                          </Col>
                          <Col xs={2}>
                            {ft.enabled &&
                              <input
                                type='number'
                                className='form-control form-control-sm'
                                min={1}
                                max={999} // TODO current + 1 or skipping enabled?
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
                        <Col xs={9}><input placeholder="Feature Name" type="text" className="form-control form-control-sm" style={{ marginLeft: '-25px' }}
                          value={ft.name}
                          onChange={event => {
                            var tmpManualFeatures = [...manualFeatures]
                            // if it was empty before
                            if (tmpManualFeatures[i].name === '') {
                              tmpManualFeatures = [...tmpManualFeatures, { enabled: false, name: '', revision: 1 }] // add new empty
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
                        </Col>
                        <Col xs={2}>
                          <input
                            type='number'
                            className='form-control form-control-sm'
                            value={ft.revision} // new features start with revision 1
                            disabled
                          />
                        </Col>
                      </Row>))}

                    {/*    <Row>
                            <Col xs={1}><input type="checkbox" id="new" className="form-check-input" checked disabled={true} /></Col>
                            <Col xs={9}><input placeholder="new feature name" type="text" className="form-control form-control-sm" style={{ marginLeft: '-25px' }}
                                onChange={event => {
                                    var tmpManualFeatures = [...manualFeatures, { enabled: true, name: event.target.value, version: 1 } as CommitFeature]
                                    /*    tmpManualFeatures[i].version = parseInt(event.target.value); 
                                    console.log(event.target.value)
                                    setManualFeatures(tmpManualFeatures);
                                }}
                            /></Col>
                            <Col xs={2}>
                                <input
                                    type='number'
                                    className='form-control form-control-sm'
                                    value={1}
                                    disabled
                                />
                            </Col>
                        </Row> */}

                    <Form.Group className="mt-3" key={3}>
                      <Form.Label>Configuration</Form.Label>
                      <Form.Control type="text" disabled value={config} readOnly />
                    </Form.Group>
                  </div>
                </Col>
              </Row >
              <Form.Group>
                <Form.Control as="textarea" required rows={1} type="text" placeholder="Commit Message" value={commitMessage} onChange={e => setCommitMessage(e.target.value)} />
                <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">Please enter a commit message!</Form.Control.Feedback>
              </Form.Group>
            </>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Col className="d-flex justify-content-between align-items-center">
            <Button variant="secondary" onClick={onModalDismiss}>Close</Button>
            <Button variant="primary" onClick={makeCommit} type="submit">Commit</Button>
          </Col>
        </Modal.Footer>
      </Modal>
    </>
  );
}