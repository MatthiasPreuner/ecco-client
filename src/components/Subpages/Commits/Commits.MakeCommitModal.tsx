import * as React from "react";
import { useSharedState } from "../../../states/AppState";

import { useDropzone, FileWithPath } from "react-dropzone";
import { useCallback, useState, useEffect } from "react";
import { CommunicationService } from "../../../services/CommunicationService";

import { Col, Row, Form, Button, Modal } from "react-bootstrap";
import { RepositoryResponse } from "../../../model/RepositoryResponse";
import {
  FileTreeView,
  FileTreeViewRef,
} from "./Commits.MakeCommitModal.FileTreeView";
import { FeatureColumn } from "./Commits.MakeCommitModal.FeatureColumn";
import { AxiosError } from "axios";
import { LoadingButton } from "../../common/LoadingButton";
import { ErrorResponseToast } from "../../common/ErrorResponseToast";
import useDrivePicker from "./Picker";

declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    // extends React's HTMLAttributes
    directory?: string;
    webkitdirectory?: string;
  }
}

export interface CommitFeature {
  enabled: boolean;
  name: string;
  revision: number;
  availablerevisions: number[];
}

export const MakeCommit: React.FC = () => {

  // ----------------------------
  const [openPicker] = useDrivePicker();
  const [SelectedData, setSelectedData] = useState([]);
  const CLIENT_ID =
    "";
    
  const API_KEY = "";

const [parentFiles, setParentFiles] = useState([]);

const MAX_RETRY_COUNT = 3;
const RETRY_DELAY_MS = 1000;

async function fetchWithRetry(url: string, options: RequestInit, retryCount = 0): Promise<Response> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Failed to fetch (${response.status}): ${response.statusText}`);
    }

    return response;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string') {
      const errorMessage = (error as any).message;
      // Retry if the error is a 503 error and the maximum number of retries has not been reached
      if (retryCount < MAX_RETRY_COUNT && errorMessage.includes('503')) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        return fetchWithRetry(url, options, retryCount + 1);
      }
    }

    throw error; // Throw the error if retries have been exhausted or it's not a 503 error
  }
}

const getFolderHierarchy = async (folderId: string, path: string, token: string) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v2/files/${folderId}/children?maxResults=10000`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch folder hierarchy.');
    }

    const { items } = await response.json();

    const childItems = [];

    for (const child of items) {
      const childResponse = await fetch(

        `https://www.googleapis.com/drive/v2/files/${child.id}?fields=id,title,mimeType,modifiedDate,fileSize,webContentLink,originalFilename`,
        // ?fields=id,title,mimeType,modifiedDate,fileSize,webContentLink,originalFilename
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (childResponse.ok) {
        const childData = await childResponse.json();
        childItems.push({
          id: childData.id,
          title: childData.title,
          mimeType: childData.mimeType,
          modifiedDate: childData.modifiedDate,
          fileSize: childData.fileSize,
          webContentLink: childData.webContentLink,
          originalFilename: childData.originalFilename,
        });
      }
    }

    const childPromises = [];
    const filesPromises = [];

    for (const file of childItems) {
      if (file.mimeType === 'application/vnd.google-apps.folder') {
        const newPath = `${path}/${file.title}`;
        const childPromise = getFolderHierarchy(file.id, newPath, token);
        childPromises.push(childPromise);
        
      } else {
        filesPromises.push(file);


        
      }
    }
    await Promise.all(childPromises);
    await Promise.all(filesPromises).then(async (filesPromises)=>{

      filesPromises.map(async(file)=>{

       // Usage in your code:
          const childResponse2 = await fetchWithRetry(
            `https://www.googleapis.com/drive/v2/files/${file.id}?alt=media`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
    
          const filefile = new File([await childResponse2.blob()],file.title);
          const filePath = `${path}/${file.title}`;
    
          setParentFiles(prevChildItems => [...prevChildItems, { filePath,filefile }]);
      })

    }


    );
  } catch (error) {
    console.error('Error fetching folder hierarchy:', error);
  }
};

const handleOpenPicker =  () => {
  setParentFiles([]);
  setConfigFile(null);
  setTmpAcceptedFiles(new Map<string, File>());
  openPicker({
    clientId: CLIENT_ID,
    developerKey: API_KEY,
    viewId: "FOLDERS",
    viewMimeTypes: "application/vnd.google-apps.folder",
    setIncludeFolders: true,
    setSelectFolderEnabled: true,
    showUploadView: true,
    showUploadFolders: true,
    supportDrives: true,
    multiselect: true,
    callbackFunction: (token, google, data) => {
      if (data.docs) {
        

        var request = new XMLHttpRequest();
        console.log('request',data.docs[0].id);
        request.open(
          "GET",
          "https://www.googleapis.com/drive/v2/files/" +
            data.docs[0].id +
            "/?fields=id,title"
        );
        request.setRequestHeader("Authorization", "Bearer " + token);
        request.addEventListener("load", async function () {
          const response = JSON.parse(request.responseText);

          const folderId = response.id;
          const title = response.title;
          const path = '/'+title;

          await getFolderHierarchy(folderId,path,token);

        });
        request.send();
      } else {
        setSelectedData([]);
      }
    },
  });
};


useEffect(()=>{

  var allFiles = new Map(tmpAcceptedFiles);

    if (parentFiles.filter((f) => f.filefile.name === f.filePath).length > 0) {
      console.log("please select a folder");
    } else {
      parentFiles.forEach((ff) => {
        let f = ff.filefile
         f.path=ff.filePath;
        if (f.name.endsWith(".config")) {
          setConfigFile(f);
        } else {
          allFiles.set(f.path, f);
        }
      });
    }
    setTmpAcceptedFiles(allFiles);

},[parentFiles])

  // ----------------------------

  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleClose = () => {
    setConfigFile(null);
    setCommitMessage("");
    setShow(false);
    setValidated(false);
    setChoosenFiles(null);
    setIsCommiting(false);
    removeAllFiles();
  };
  const handleShow = () => setShow(true);

  let onModalDismiss = () => {
    handleClose();
  };

  const [appState, setAppState] = useSharedState();

  const [tmpAcceptedFiles, setTmpAcceptedFiles] = useState<
    Map<String, FileWithPath>
  >(new Map<String, FileWithPath>()); // as Map to prevent duplicates, old files will be overwritten
  const [configFile, setConfigFile] = useState<FileWithPath>(null);
  const [commitMessage, setCommitMessage] = useState<string>("");
  const [choosenFiles, setChoosenFiles] = useState<Array<FileWithPath>>(
    new Array<FileWithPath>()
  );
  const [isCommiting, setIsCommiting] = useState<boolean>(false);
  const [errorResponse, setErrorResponse] = useState<AxiosError>(null);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {

    var allFiles = new Map(tmpAcceptedFiles);

    if (acceptedFiles.filter((f) => f.name === f.path).length > 0) {
      console.log("please select a folder");
    } else {
      acceptedFiles.forEach((f) => {
        if (f.name.endsWith(".config")) {
          setConfigFile(f);
        } else {
          allFiles.set(f.path, f);
        }
      });
    }
    setTmpAcceptedFiles(allFiles);
  }, []);


  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({ onDrop });
  const [configString, setConfigString] = useState<string>("");

  let handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();

    if (
      form.checkValidity() &&
      tmpAcceptedFiles.size !== 0 &&
      configString.length !== 0
    ) {
      setIsCommiting(true);
      CommunicationService.getInstance()
        .makeCommit(
          appState.repository,
          commitMessage,
          configString,
          appState.loggedUserName,
          choosenFiles
        )
        .then(
          (apiData: RepositoryResponse) => {
            setAppState((previousState) => ({
              ...previousState,
              repository: apiData.data,
            }));
            setIsCommiting(false);
            handleClose();
          },
          (e: AxiosError) => {
            setErrorResponse(e);
            setIsCommiting(false);
          }
        );
    }
    setValidated(true);
  };

  let removeAllFiles = () => {
    setTmpAcceptedFiles(new Map<string, File>());
  };


  const treeViewRef = React.useRef<FileTreeViewRef>(null);

  return (
    <>
      <Button variant="primary" className="w-100" onClick={handleShow}>
        New Commit
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="xl"
        className="no-user-select"
      >
        <Modal.Header closeButton>
          <Modal.Title>New Commit</Modal.Title>
        </Modal.Header>
        <Form validated={validated} onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="mb-3" {...getRootProps()}>
              <input {...getInputProps()} directory="" webkitdirectory="" />
              <Col
                className={
                  "mx-2 d-flex rounded align-items-center align-content-center justify-content-around drop-zone " +
                  (isDragActive ? "drop-zone-active" : "")
                }
              >
                {isDragActive ? (
                  <p className="m-0">
                    Drop the folder here ... it can't be a file
                  </p>
                ) : (
                  <p className="m-0">
                    Drag 'n' drop a folder here, or click to select a folder
                  </p>
                )}
              </Col>

              <Col
                className="mx-2 d-flex rounded align-items-center align-content-center justify-content-around btn btn-primary"
                onClick={handleOpenPicker}
              >
                Select folder from drive
              </Col>

            </Row>
            <Row style={{ minHeight: "45vh" }}>
              <Col xs={6}>
                <Row className="mb-1">
                  <Col xs={8}>
                    <h4 className="mb-0">Files</h4>
                  </Col>
                  <Col xs={4}>
                    {tmpAcceptedFiles.size === 0 ? (
                      <Button
                        variant="light"
                        style={{ width: "100%" }}
                        size="sm"
                        disabled
                      >
                        no Files selected
                      </Button>
                    ) : (
                      <Button
                        variant="danger"
                        style={{ width: "100%" }}
                        size="sm"
                        onClick={removeAllFiles}
                        disabled={tmpAcceptedFiles.size < 1}
                      >
                        Remove all files
                      </Button>
                    )}
                  </Col>
                </Row>
                <Row className="ps-0">
                  <Col>
                    <Row
                      key={0}
                      className="feedback-row"
                      style={{
                        position: "sticky",
                        top: "0",
                        left: "0",
                        backgroundColor: "#fff",
                        zIndex: 5,
                      }}
                    >
                      {tmpAcceptedFiles.size > 0 ? (
                        <>
                          <Col xs={9}>
                            <Form.Group>
                              <Form.Control
                                isInvalid={choosenFiles?.length === 0}
                                isValid={choosenFiles?.length > 0}
                                type="hidden"
                              />
                              <Form.Control.Feedback type="valid">
                                {choosenFiles?.length} files selected.
                              </Form.Control.Feedback>
                              <Form.Control.Feedback type="invalid">
                                At least one File needs to be selected!
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col className="rct-options rct-options-custom">
                            <button
                              key={"b0"}
                              onClick={() => treeViewRef.current.expandAll()}
                              aria-label="Expand all"
                              title="Expand all"
                              type="button"
                              className="rct-option rct-option-expand-all"
                            >
                              <i className="bi bi-plus-square" />
                            </button>
                            <button
                              key={"b1"}
                              onClick={() => treeViewRef.current.collapseAll()}
                              aria-label="Collapse all"
                              title="Collapse all"
                              type="button"
                              className="rct-option rct-option-collapse-all"
                            >
                              <i className="bi bi-dash-square" />
                            </button>
                          </Col>
                        </>
                      ) : (
                        <i>Please select a folder.</i>
                      )}
                    </Row>
                    <Row
                      style={{
                        height: "40vh",
                        overflowY: "scroll",
                        overflowX: "auto",
                        marginRight: "0px",
                        marginLeft: "0px",
                        position: "relative",
                      }}
                    >
                      <FileTreeView
                        files={tmpAcceptedFiles}
                        onChange={(files) => setChoosenFiles(files)}
                        ref={treeViewRef}
                      />
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col xs={6}>
                <Row className="mb-1">
                  <Col xs={8}>
                    <h4 className="mb-0">Features</h4>
                  </Col>
                  <Col xs={4}>
                    {configFile === null ? (
                      <Button
                        variant="light"
                        style={{ width: "100%" }}
                        size="sm"
                        disabled
                      >
                        .config not found
                      </Button>
                    ) : (
                      <Button
                        variant="danger"
                        style={{ width: "100%" }}
                        size="sm"
                        onClick={() => setConfigFile(null)}
                        disabled={configFile === null}
                      >
                        Remove Config File
                      </Button>
                    )}
                  </Col>
                </Row>
                <FeatureColumn
                  configFile={configFile}
                  setConfigString={setConfigString}
                />
              </Col>
            </Row>
            <Form.Group className="mb-1" key={3}>
              <Form.Label>Configuration</Form.Label>
              <Form.Control
                type="text"
                disabled
                value={configString}
                readOnly
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                as="textarea"
                required
                rows={1}
                type="text"
                placeholder="Commit Message"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
              />
            </Form.Group>
            <ErrorResponseToast error={errorResponse} />
          </Modal.Body>
          <Modal.Footer>
            <Col className="d-flex justify-content-between align-items-center">
              <Button variant="secondary" onClick={onModalDismiss}>
                Close
              </Button>
              <LoadingButton
                loading={isCommiting}
                variant="primary"
                type="submit"
              >
                Commit Test
              </LoadingButton>
            </Col>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
