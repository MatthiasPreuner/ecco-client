import * as React from "react";
import { useDropzone, FileWithPath } from 'react-dropzone'
import { useCallback, useState, useEffect } from "react";
import { CommunicationService } from "../../../services/CommunicationService";

import { Container, Col, Row, InputGroup, Form, Table, Button, ListGroup, Card, FormControl } from 'react-bootstrap';

interface CommitFeature {
    enabled: boolean,
    name: string,
    version: number,
}

export const Dropzone: React.FC = () => {

    const [tmpAcceptedFiles, setTmpAcceptedFiles] = useState<Map<String,FileWithPath>>(new Map<String, FileWithPath>());
    const [configFile, setConfigFile] = useState<FileWithPath>(undefined);

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        console.log("do smth with the files...", acceptedFiles);
        
        var allFiles: Map<String, FileWithPath> = new Map<String, FileWithPath>();
        acceptedFiles.forEach(f => {
            allFiles.set(f.path, f);
        })

        // search for config file
        const configFile = Array.from(allFiles.values()).find(file => file.name.endsWith(".config"));
        setConfigFile(configFile);

        var CommitFeatures: CommitFeature[] = [];

        if (configFile != undefined) {

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
                        version: parseInt(nameversion[1]),
                    }
                    return feature;
                })
                setConfigFeatures(CommitFeatures);
            };
            reader.readAsText(configFile);
            console.log("Result: " + reader.result);
            console.log('Features: ' + CommitFeatures);
            allFiles.delete(configFile.path)
        }

        setTmpAcceptedFiles(allFiles);

    }, []);
      
    const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const [configFeatures, setConfigFeatures] = useState<CommitFeature[]>([]);

    /*     let sendAllFilesToTheBackend = () => {
            console.log(tmpAcceptedFiles);
            CommunicationService.getInstance().commitFilesInsideZIPFile(tmpAcceptedFiles).then((response: any) => {
                document.getElementById("zipfilesucessalert").classList.add("show");
            }).catch().finally(() => {
                setTimeout(() => {
                    document.getElementById("zipfilesucessalert").classList.remove("show");
                }, 3000);
            });
        }
     */

    // TODO remove properly :D
    let removeFile = (file: FileWithPath) => {
        tmpAcceptedFiles.delete(file.path);
      /*   console.log(newFiles); */
        setTmpAcceptedFiles(tmpAcceptedFiles);
    }

    let removeAllFiles = () => {
        setTmpAcceptedFiles(new Map<string, FileWithPath>());
    }

    let removeConfigFile = () => {
        setConfigFile(null);
    }

    const files = Array.from(tmpAcceptedFiles.values()).map((file: FileWithPath) => (
        <li key={file.name} className='pb-1'>
            <Button onClick={() => removeFile(file)} variant={'danger'} size={'sm'}><i className="bi bi-x"></i></Button> {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <>
            {/*   <div id={"zipfilesucessalert"} className="alert alert-success alert-dismissible ecco-alert fade" role="alert">
                The files are sucessfully committed into the Repository!
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div> */}
            <Row {...getRootProps()}>
                <input {...getInputProps()} />
                <Row className="mb-3">
                    <Col style={{ height: "100px", border: "1px solid #d8d8d8", backgroundColor: "#ececec" }} className="mx-2 d-flex rounded align-items-center align-content-center justify-content-around">
                        {
                            isDragActive ?
                                <div className="w-100 d-flex justify-content-around align-items-center align-content-center">
                                    <h1 className="bi bi-arrow-down-circle-fill"></h1>
                                    <p className={"m-0"}>Drop the files here ...</p>
                                    <h1 className="bi bi-arrow-down-circle-fill"></h1>
                                </div> :

                                <>
                                    <h1 className="bi bi-arrow-down-circle-fill"></h1>
                                    <p className={"m-0"}>Drag 'n' drop some files or folders here, or click to select files</p>
                                    <h1 className="bi bi-arrow-down-circle-fill"></h1>
                                </>
                        }
                    </Col>
                </Row>
            </Row>
            <Row  style={{ minHeight: "45vh" }}>
                <Col xs={6}>
                    <Row>
                        <Col xs={8}><h4>Files</h4></Col>
                        <Col xs={4}>
                            {(configFile == null) ?
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

                    <Form className="mb-3">
                        {configFeatures.map((ft, i) => (
                            <>
                                <Row>
                                    <Col xs={10}>
                                        <Form.Check
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
                                        <input
                                            type='number'
                                            className='form-control form-control-sm'
                                            min={1}
                                            max={999} // TODO current + 1 or skipping enabled?
                                            value={ft.version}
                                            disabled={!ft.enabled}
                                            onChange={event => {
                                                var newConfigFeatures = [...configFeatures]
                                                newConfigFeatures[i].version = parseInt(event.target.value);
                                                setConfigFeatures(newConfigFeatures);
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </>
                        ))}
                        <Row>
                            <Col xs={1}><input type="checkbox" id="new" className="form-check-input" checked disabled={true} /></Col>
                            <Col xs={9}><input placeholder="new feature name" type="text" className="form-control form-control-sm" style={{ marginLeft: '-25px' }} /></Col>
                            <Col xs={2}>
                                <input
                                    type='number'
                                    className='form-control form-control-sm'
                                    value={1}
                                    disabled
                                />
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row >
        </>
    )
}
