import * as React from "react";
import { useSharedState } from "../../../states/AppState";
import { useState, useEffect } from "react";
import $ from 'jquery'
import { Col, Row, ListGroup, Card, Dropdown, Badge, Stack, Button } from 'react-bootstrap';

import { VariantModel } from "../../../model/VariantModel";
import { FeatureModel } from "../../../model/FeatureModel";
import { CommunicationService } from "../../../services/CommunicationService";
import { RepositoryResponse } from "../../../model/RepositoryResponse";
import { FeatureRevisionModel } from "../../../model/FeatureRevisionModel";


export const Features: React.FC<{ variant: VariantModel }> = (props) => {

    const [appState, setAppState] = useSharedState();

    let variantAddFeature = (variant: VariantModel, feature: FeatureModel) => {
        CommunicationService.getInstance().variantAddFeature(appState.repository, variant, feature)
            .then((apiData: RepositoryResponse) => {
                setAppState((previousState) => ({
                    ...previousState,
                    repository: apiData.data
                }));

            });
    }

    let variantRemoveFeature = (featureRevision: FeatureRevisionModel) => {
        CommunicationService.getInstance().variantRemoveFeature(appState.repository, props.variant, featureRevision.featureRevisionString.split('.')[0])
            .then((apiData: RepositoryResponse) => {
                setAppState((previousState) => ({
                    ...previousState,
                    repository: apiData.data
                }));
            });
    }

    let variantUpdateFeature = (variant: VariantModel, featureName: string, revision: string) => {
        CommunicationService.getInstance().variantUpdateFeature(appState.repository, variant, featureName, revision)
            .then((apiData: RepositoryResponse) => {
                setAppState((previousState) => ({
                    ...previousState,
                    repository: apiData.data
                }));
            });
    }

    let addableFeatures = () => {
        if (props.variant == null) return [];
        let f = appState.repository.features
            .filter(f => props.variant.configuration.featureRevisions
                .find(r => r.featureRevisionString
                    .includes(f.name)) === undefined);
        return f
    }

    let AddableFeatures = addableFeatures();

    let testen = () => {
        //$('.xyz').toggle(); //dropdown();


        document.getElementById("xyz0").addEventListener("show.bs.dropdown", (e) => console.log(e))
        document.getElementById("xyz0").firstChild.addEventListener("click", () => console.log("click"))
    }

    useEffect(() => {
        console.log("test")
        $("dropdown").each(function () {
            $(this).on("show.bs.dropdown", function () {
                console.log("show")
                var $btnDropDown = $(this).find(".dropdown-toggle");
                var $listHolder = $(this).find(".dropdown-menu");
                //reset position property for DD container
                $(this).css("position", "static");
                $listHolder.css({
                    "top": ($btnDropDown.offset().top + $btnDropDown.outerHeight(true)) + "px",
                    "left": $btnDropDown.offset().left + "px"
                });
                $listHolder.data("open", true);
            });
        });

        /*     $('.dropdown').on('show.bs.dropdown', function () {
                $('body').append($('.dropdown').css({
                    position: 'absolute',
                    left: $('.dropdown').offset().left,
                    top: $('.dropdown').offset().top
                }).detach());
            }); */
    }, [props.variant]);

    let test = () => {
        console.log("test")

    }
    // React.UIEvent<HTMLElement>
    let scroll = (e: React.UIEvent<HTMLElement>) => {
        console.log(e.currentTarget.scrollTop);
    }

    return (
        <Col xs={3} className="mr-auto mb-3">
            <Row>
                <Col xs={8}><h5>Features</h5></Col>
                <Col className="float-end">
                    <Dropdown>
                        <Dropdown.Toggle disabled={AddableFeatures.length < 1} variant="primary" bsPrefix="btn ms-1 badge bg-primary float-end">
                            <i className="bi bi-plus-lg"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {AddableFeatures.map((feature, i) =>
                                (<Dropdown.Item key={i} onClick={() => variantAddFeature(props.variant, feature)}>{feature.name}</Dropdown.Item>)
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>

            <Card>
                <ListGroup variant="flush"
                    className='mb-0'
                    onScroll={e => scroll(e)}
                    >
                    {props.variant.configuration.featureRevisions.sort((a, b) => a.featureRevisionString.localeCompare(b.featureRevisionString)).map((rev, i) => {

                        let possibleFeatureRevisions = appState.repository.features.find(f => f.name === rev.featureRevisionString.split('.')[0]).revisions
                            .sort((a, b) => Number(a.id) - Number(b.id));

                        return (
                            <ListGroup.Item key={i}>{rev.featureRevisionString.split('.')[0]}
                                <Stack gap={1} direction="horizontal" className="float-end ">
                                    <Dropdown className="xyz" data-bs-boundary="body" >
                                        <Dropdown.Toggle data-bs-boundary="body" data-toggle="dropdown" disabled={possibleFeatureRevisions.length <= 1} variant="primary" bsPrefix="btn ms-1 badge bg-primary">
                                            {rev.featureRevisionString.split('.')[1]}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu id={"xyz" + i}>
                                            {possibleFeatureRevisions.map((revision, i) =>
                                            (revision.id === rev.id ?
                                                <Dropdown.Item className="bg-secondary" key={i}>{revision.id}</Dropdown.Item> :
                                                <Dropdown.Item className={(revision.id === rev.id ? "bg-secondary" : "")} key={i} onClick={() => variantUpdateFeature(props.variant, revision.featureRevisionString.split('.')[0], revision.id)}>{revision.id}</Dropdown.Item>)
                                            )}
                                        </Dropdown.Menu>
                                    </Dropdown>

                                    < div >
                                        <Badge bg="primary" className='btn' onClick={() => variantRemoveFeature(rev)}><i className="bi bi-x-lg"></i></Badge>
                                    </div>
                                </Stack>
                            </ListGroup.Item>
                        )
                    })}
                </ListGroup >
                <Button onClick={testen} style={{height: '10px'}}><i className="bi bi-caret-up-fill"></i></Button>
            </Card >
        </Col >

    )

}
