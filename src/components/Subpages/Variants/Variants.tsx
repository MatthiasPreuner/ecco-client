import * as React from "react";
import { useSharedState } from "../../../states/AppState";
import { useState, useEffect } from "react";
import { CreateVariant } from "./Variants.CreateVariantModal";
import { useNavigate } from 'react-router-dom';

import { Container, Col, Row, InputGroup, Table, Button, DropdownButton, Dropdown, FormControl, Badge, Stack } from 'react-bootstrap';

import { VariantModel } from "../../../model/VariantModel";
import { DeleteVariantModal } from "./Variants.DeleteVariantModal";
import { FeatureModel } from "../../../model/FeatureModel";
import { Features } from "./Variants.Feature";
import { CommunicationService } from "../../../services/CommunicationService";
import { RepositoryResponse } from "../../../model/RepositoryResponse";

import './Variants.scss';
import { TableInfoRow } from "../../common/TableInfoRow";

export const Variants: React.FC = () => {

    const [appState, setAppState] = useSharedState();
    const [selectedVariant, setSelectedVariant] = useState<VariantModel>(null);
    const [variantFilterText, setVariantFilterText] = useState<string>("");
    const [featureFilter, setFeatureFilter] = useState<FeatureModel[]>([]);
    const [editVariant, setEditVariant] = useState<VariantModel>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!appState.userIsLoggedIn || appState.repository === null) {
            navigate(`/`)
        } else {
            setSelectedVariant(appState.repository.variants.find(v => v.id === selectedVariant?.id)) // update, when new repository is received after changing smtg
        }
    }, [appState.repository, appState.userIsLoggedIn, selectedVariant, navigate]);

    const updateVariant = () => {
        CommunicationService.getInstance().updateVariant(appState.repository, editVariant).then((apiData: RepositoryResponse) => {
            setAppState((previousState) => ({
                ...previousState,
                repository: apiData.data
            }));
        });
        setEditVariant(null);
    };

    const changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditVariant((previousState) => ({
            ...previousState,
            name: e.target.value
        }));
    }

    const changeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditVariant((previousState) => ({
            ...previousState,
            description: e.target.value
        }));
    }

    let infoMessage: string = "";
    const getCurrentVariantExpression = (): JSX.Element[] => {

        var filteredByFeatures = appState.repository?.variants.filter(vari => featureFilter.map(f => f.name).every(e => vari.configuration.featureRevisions.map(r => r.featureName).includes(e)));
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
                                <td style={{ width: '20%' }}>
                                    <InputGroup size='sm' className="w-100">
                                        <FormControl
                                            type="text"
                                            placeholder="Variant Name"
                                            value={editVariant.name}
                                            onChange={changeName}
                                        />
                                    </InputGroup>
                                </td>
                                <td style={{ width: '80%' }}>
                                    <Stack gap={1} direction="horizontal" className="float-end w-100">
                                        <InputGroup size='sm' className="w-100">
                                            <FormControl
                                                type="text"
                                                placeholder="Variant Description"
                                                value={editVariant.description}
                                                onChange={changeDescription}
                                            />
                                        </InputGroup>
                                        <Badge key={0} bg="secondary" className='btn' onClick={() => updateVariant()}><i className="bi bi-check-lg"></i></Badge>
                                        <Badge key={1} bg="secondary" className='btn' onClick={() => setEditVariant(null)}><i className="bi bi-x-lg"></i></Badge>
                                    </Stack>
                                </td>
                            </> :
                            <>
                                <td>{variant.name}</td>
                                <td style={{ width: '80%' }}>{variant.description}
                                    <Stack gap={1} direction="horizontal" className="float-end">
                                        {editVariant === null &&
                                            <Badge bg="secondary" className='btn' onClick={() => setEditVariant({ ...variant })}><i className="bi bi-pencil-square"></i></Badge>}
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
        CommunicationService.getInstance().checkOutVariant(appState.repository, selectedVariant);
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
                            <Col xs={6} />
                            <Col xs={6}>
                                <Button className="w-100" onClick={checkOutVariant}>Checkout Variant</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {selectedVariant != null &&
                    <Row>
                        <Features variant={selectedVariant} />
                        <Col xs={3} className="mr-auto mb-3">
                            <h5>Associations</h5>
                        </Col>
                    </Row>
                }
            </Col >
        </Container >
    )
}
