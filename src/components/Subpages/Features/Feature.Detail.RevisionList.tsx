import * as React from "react";
import { FeatureModel } from "../../../model/FeatureModel";
import { useEffect, useState } from "react";

import { FeatureRevisionModel as FeatureRevisionModel } from "../../../model/FeatureRevisionModel";
import { CommunicationService } from "../../../services/CommunicationService";
import { FeatureRevisionResponse } from "../../../model/FeatureRevisionResponse";
import { FeatureSpecificRevisionDetail } from "./Feature.Detail.RevisionDetail";

import { FeatureDetail } from "./Feature.Detail";

import { Container, Col, Row, InputGroup, FormControl, Button, Card, Accordion, Form, ListGroup, ButtonGroup } from 'react-bootstrap';

interface FeatureSpecificRevisionProps {
    currentFeature: FeatureModel
}

export const FeatureSpecificRevisionList: React.FC<FeatureSpecificRevisionProps> = ({ currentFeature }) => {

    /* const [featureRevisions, setFeatureRevisions] = useState<FeatureRevisionModel[]>(currentFeature.revisions); */
    /*  const [currentFeatureRevision, setCurrentFeatureRevision] = useState<FeatureRevisionModel>(null); */

/*     static getDerivedStateFromProps(props, current_state) {
        if (current_state.value !== props.value) {
          return {
            value: props.value,
            computed_prop: heavy_computation(props.value)
          }
        }
        return null
      }
 */
    const [currentFeatureRevisionIndex, setCurrentFeatureRevisionIndex] = useState<number>(currentFeature.revisions.length - 1);
    useEffect(() => {
        /*       CommunicationService.getInstance().getFeatureversionsFromFeature(currentFeature).then((featureRevisionResponse: FeatureRevisionResponse) => {
                  setFeatureRevisions(featureRevisionResponse.data);
              }); */
              console.log(currentFeature.revisions.length)
        setCurrentFeatureRevisionIndex(currentFeature.revisions.length - 1);
        /*       setCurrentFeatureRevision(null); */
    }, [currentFeature]);

    /*     const featureRevisionsComponent = currentFeature.revisions.map((featureRevision: FeatureRevisionModel) => {
            let setCurrentFeatureRevisionCallback = () => {
                setCurrentFeatureRevision(featureRevision);
            }
    
            let validHTMLID = "validid" + featureRevision.id;
    
            return (
                <Card key={validHTMLID}>
                    <Card.Header id="headingThree">
                        <h2 className="mb-0">
                            <button onClick={setCurrentFeatureRevisionCallback} className="btn btn-link btn-block text-center collapsed" type="button"
                                data-toggle="collapse" data-target={"#" + validHTMLID}>
                                {featureRevision.id}
                            </button>
                        </h2>
                    </Card.Header>
                    <div id={validHTMLID} className="collapse" data-parent="#featureVersionAccordionList">
                        {currentFeatureRevision == null ? "" : <FeatureSpecificRevisionDetail currentFeature={currentFeature} currentFeatureRevision={currentFeatureRevision} />}
                    </div>
                </Card>
            );
        }); */

    const btnVariant = 'primary';

    return (
        <Row>
            <Col>
                <h5>Featurerevisions:</h5>

                <ButtonGroup className="m-2 d-flex justify-content-between">
                    <Button variant={btnVariant}
                        disabled={currentFeatureRevisionIndex == 0}
                        onClick={() => setCurrentFeatureRevisionIndex(0)}>&lt;&lt;</Button>
                    <Button variant={btnVariant}
                        disabled={currentFeatureRevisionIndex == 0}
                        onClick={() => setCurrentFeatureRevisionIndex(currentFeatureRevisionIndex - 1)}>&lt;</Button>
                    <Button variant={btnVariant} style={{ width: '50px' }}>
                        
                        {currentFeature.revisions[currentFeatureRevisionIndex]?.id || currentFeature.revisions[currentFeature.revisions.length - 1].id }
                        </Button>
                    <Button variant={btnVariant}
                        disabled={currentFeatureRevisionIndex == currentFeature.revisions.length - 1}
                        onClick={() => setCurrentFeatureRevisionIndex(currentFeatureRevisionIndex + 1)}>&gt;</Button>
                    <Button variant={btnVariant}
                        disabled={currentFeatureRevisionIndex == currentFeature.revisions.length - 1}
                        onClick={() => setCurrentFeatureRevisionIndex(currentFeature.revisions.length - 1)}>&gt;&gt;</Button>
                </ButtonGroup>
                <FeatureSpecificRevisionDetail
                    currentFeature={currentFeature} 
                    currentFeatureRevision={
                        currentFeature.revisions[currentFeatureRevisionIndex] || currentFeature.revisions[currentFeature.revisions.length - 1]                     
                        }
                    />
            </Col>
        </Row>
    );
}
