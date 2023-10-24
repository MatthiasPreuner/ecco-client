import * as React from "react";
import { useSharedState } from "../../../states/AppState";
import { useState, useEffect } from "react";
import { CreateVariant } from "./Variants.CreateVariantModal";

import { Container, Col, Row, InputGroup, Table, Button, DropdownButton, Dropdown, Form, FormControl, Stack } from 'react-bootstrap';
import { VariantModel } from "../../../model/VariantModel";
import { DeleteVariantModal } from "./Variants.DeleteVariantModal";
import { FeatureModel } from "../../../model/FeatureModel";
import { Features } from "./Variants.Feature";
import { CommunicationService } from "../../../services/CommunicationService";
import { RepositoryResponse } from "../../../model/RepositoryResponse";
import { LoadingButton } from "../../common/LoadingButton";
import { AxiosError } from "axios";
import { ErrorResponseToast } from "../../common/ErrorResponseToast";
import { TableInfoRow } from "../../common/TableInfoRow";

import './Variants.scss';


export const Variants: React.FC = () => {

    const [appState, setAppState] = useSharedState();
    const [selectedVariant, setSelectedVariant] = useState<VariantModel>(null);
    const [variantFilterText, setVariantFilterText] = useState<string>("");
    const [featureFilter, setFeatureFilter] = useState<FeatureModel[]>([]);
    const [editVariant, setEditVariant] = useState<VariantModel>(null);
    const [errorResponse, setErrorResponse] = useState<AxiosError>();
    const [checkingOut, setCheckingOut] = useState<boolean>(false);
    const [showCommitVariants, setShowCommitVariants] = useState<boolean>(false);
    const [updatingVariant, setUpdatingVariant] = useState<boolean>(false);

    useEffect(() => {
        if (appState.repository)
            setSelectedVariant(appState.repository.variants.find(v => v.id === selectedVariant?.id)) // update, when new repository is received after changing smtg
    }, [appState.repository, selectedVariant]);

    const updateVariant = () => {
        setUpdatingVariant(true)
        CommunicationService.getInstance().updateVariant(appState.repository, editVariant).then((apiData: RepositoryResponse) => {
            setAppState((previousState) => ({ ...previousState, repository: apiData.data }));
            setEditVariant(null);
            setUpdatingVariant(false);
            setErrorResponse(null);
        }, (e) => {
            setErrorResponse(e);
            setEditVariant(null);
            setUpdatingVariant(false);
        })
    };

    let infoMessage: string = "";
    const getCurrentVariantExpression = (): JSX.Element[] => {

        var filteredCommitVariants = showCommitVariants ? appState.repository?.variants : appState.repository?.variants.filter(v => !v.name.includes("Commit"))
        var filteredByFeatures = filteredCommitVariants?.filter(vari => featureFilter.map(f => f.name).every(e => vari.configuration.featureRevisions.map(r => r.featureName).includes(e)));
        var filteredByFeaturesAndText = filteredByFeatures?.filter(variant => (variant.name?.toLowerCase().includes(variantFilterText.toLowerCase()) || variant.description?.toLowerCase().includes(variantFilterText.toLowerCase())))

        if (appState.repository?.features.length === 0) {
            infoMessage = "Repository has no Features yet, please make a Commit before creating a new Variant!"
        } else if (appState.repository?.variants.length === 0) {
            infoMessage = "Repository has no Variants yet, please create a new Variant!"
        } else if (filteredByFeaturesAndText?.length === 0) {
            infoMessage = "No matches found, please change search parameters!"
        } else {
            infoMessage = ""
            return filteredByFeaturesAndText?.map((variant: VariantModel, i) => {
                return (
                    <tr onClick={() => editVariant === null && setSelectedVariant(variant)} className={selectedVariant === variant ? "btn-primary" : null} key={i}>
                        {editVariant?.id === variant.id ?
                            <>
                                <td style={{ minWidth: '20%' }}>
                                    <InputGroup size='sm' className="w-100">
                                        <FormControl
                                            type="text"
                                            placeholder="Variant Name"
                                            value={editVariant.name}
                                            onChange={e => setEditVariant((prev) => ({ ...prev, name: e.target.value }))}
                                        />
                                    </InputGroup>
                                </td>
                                <td style={{ minWidth: '80%' }}>
                                    <Stack gap={1} direction="horizontal" className="float-end w-100">
                                        <InputGroup size='sm' className="w-100">
                                            <FormControl
                                                type="text"
                                                placeholder="Variant Description"
                                                value={editVariant.description}
                                                onChange={e => setEditVariant((prev) => ({ ...prev, description: e.target.value }))}
                                            />
                                        </InputGroup>
                                        <LoadingButton key={0} hideContentWhileLoading loading={updatingVariant} variant="secondary" size="sm" style={{ padding: "0rem 0.25rem" }} onClick={() => updateVariant()}><i className="bi bi-check-lg" /></LoadingButton>
                                        <Button key={1} disabled={updatingVariant} variant="secondary" size="sm" style={{ padding: "0rem 0.25rem" }} onClick={() => setEditVariant(null)}><i className="bi bi-x-lg" /></Button>
                                    </Stack>
                                </td>
                            </> :
                            <>
                                <td>{variant.name}</td>
                                <td style={{ minWidth: '80%' }}>{variant.description}
                                    <Stack gap={1} direction="horizontal" className="float-end">
                                        {editVariant === null && <Button key={1} disabled={updatingVariant} variant="secondary" size="sm" style={{ padding: "0rem 0.25rem" }} onClick={() => setEditVariant({ ...variant })}><i className="bi bi-pencil-square" /></Button>}
                                    </Stack>
                                </td>
                            </>
                        }
                    </tr>
                );
            }).filter((singleJSXElement: JSX.Element) => {
                return singleJSXElement !== undefined || singleJSXElement !== null;
            });
        }
    }
    let filteredVariants = getCurrentVariantExpression();

    let addFeatureFilter = (feature: FeatureModel) => {
        setFeatureFilter([...featureFilter, feature]);
    }

    let removeFeatureFilter = (feature: FeatureModel) => {
        setFeatureFilter([...featureFilter].filter(f => f !== feature));
    }

    let featureFilterDropdown = appState.repository?.features.filter(
        f => featureFilter.indexOf(f) === -1
    )
    
    let checkOutVariant = () => {
        setCheckingOut(true)
        CommunicationService.getInstance().checkOutVariant(appState.repository, selectedVariant).then((response: any) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'checkout.zip'); 
            document.body.appendChild(link);
            const blobFile = new Blob([response.data]); 
            const desiredFileName = 'Checkout.zip'; 
            const accessToken = '';
    
            CommunicationService.uploadFileToGoogleDrive(blobFile, desiredFileName, accessToken)
                .then((response) => {
                    alert('File uploaded successfully on Google Drive');
                })
                .catch((error) => {
                    console.error('Error uploading file:', error);
                });
            link.click();
            setCheckingOut(false)
            setErrorResponse(null);
        }, (e) => {
            setErrorResponse(e);
            setCheckingOut(false);
        })
    }

    return (
        <Container className="main d-flex pt-4 justify-content-center">
            <Col>
                <Row>
                    <h3>Variants</h3>
                </Row>
                <Row>
                    <Col xs={8}>
                        <Table hover size='sm' className="table-fixed table-responsive variant-table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th style={{ minWidth: '20%' }}>Name</th>
                                    <th style={{ minWidth: '80%' }}>Description</th>
                                </tr>
                            </thead>
                            <tbody style={{ height: "35vh" }}>
                                {filteredVariants}
                                <TableInfoRow message={infoMessage} />
                            </tbody>
                        </Table>
                    </Col>
                    <Col>
                        <Row className="mb-3">
                            <Col xs={6}><CreateVariant /></Col>
                            <Col xs={6}>
                                <DeleteVariantModal variant={selectedVariant} />
                            </Col>
                        </Row>
                        <Row>
                            <InputGroup className="mb-3">
                                <InputGroup.Text><i className="bi bi-funnel-fill"></i></InputGroup.Text>
                                <FormControl
                                    placeholder="Text for filtering..."
                                    onChange={e => setVariantFilterText(e.target.value)}
                                    value={variantFilterText}
                                />
                                {variantFilterText.length > 0 ? <Button variant="outline-primary" onClick={() => setVariantFilterText("")}><i className="bi bi-x"></i></Button> : null}
                            </InputGroup>
                        </Row>
                        <Row>
                            <InputGroup className="mb-3">
                                <DropdownButton bsPrefix="dropdown-toggle btn btn-custom-color dropdown-btn" style={{ border: '1px solid #ced4da' }} disabled={featureFilterDropdown?.length === 0} title="">
                                    {featureFilterDropdown?.map((feature, i) => {
                                        return (
                                            <Dropdown.Item key={i} onClick={() => addFeatureFilter(feature)}>{feature.name}</Dropdown.Item>
                                        )
                                    })}
                                </DropdownButton>
                                <div className='form-control py-0 px-0'>
                                    <div className="d-flex flex-wrap px-0" style={{ minHeight: '46px' }}>
                                        {featureFilter?.map((feature, i) => {
                                            return (
                                                <Button className="ms-1 my-1" size='sm' onClick={() => removeFeatureFilter(feature)} key={i}>{feature.name} <i className="bi bi-x-lg"></i></Button>
                                            )
                                        })}
                                    </div>
                                </div>
                                {featureFilter.length > 0 ? <Button variant="outline-primary" onClick={() => setFeatureFilter([])}><i className="bi bi-x"></i></Button> : null}
                            </InputGroup>
                        </Row>
                        <Row>
                            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                <Form.Check type="checkbox" label="Show autogenerated Commit variants" checked={showCommitVariants} onChange={e => setShowCommitVariants(e.target.checked)} />
                            </Form.Group>
                        </Row>
                        <Row>
                            <ErrorResponseToast error={errorResponse} />
                            <Col xs={6} />
                            <Col xs={6}>
                                <LoadingButton loading={checkingOut} className="w-100" onClick={checkOutVariant} disabled={!selectedVariant}>Checkout Variant</LoadingButton>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {selectedVariant != null &&
                    <Row>
                        <Features variant={selectedVariant} />
                       {/*  <Col xs={3} className="mr-auto mb-3">
                            <h5>Associations</h5>
                        </Col> */}
                    </Row>
                }
            </Col >
        </Container >
    )
}
