import { createRoot } from 'react-dom/client';
import './schedule.css';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Day, Week, WorkWeek, Month, Agenda, ScheduleComponent, ResourcesDirective, ResourceDirective, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';
import { extend } from '@syncfusion/ej2-base';


import { Query, Predicate } from '@syncfusion/ej2-data';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { PropertyPane } from './property-pane';
import * as dataSource from './datasource.json';

const SchedulePage = () => {
    let scheduleObj = useRef(null);
    let ownerOneObj = useRef(null);
    let ownerTwoObj = useRef(null);
    let ownerThreeObj = useRef(null);
    const data = extend([], dataSource.resourceSampleData, null, true);
    const resourceData = [
        { Text: 'Margaret', Id: 1, Color: '#ea7a57' },
        { Text: 'Robert', Id: 2, Color: '#df5286' },
        { Text: 'Laura', Id: 3, Color: '#865fcf' }
    ];
    const onChange = () => {
        let predicate;
        let checkBoxes = [ownerOneObj.current, ownerTwoObj.current, ownerThreeObj.current];
        checkBoxes.forEach((checkBoxObj) => {
            if (checkBoxObj.checked) {
                if (predicate) {
                    predicate = predicate.or('OwnerId', 'equal', parseInt(checkBoxObj.value, 10));
                }
                else {
                    predicate = new Predicate('OwnerId', 'equal', parseInt(checkBoxObj.value, 10));
                }
            }
        });
        scheduleObj.current.eventSettings.query = new Query().where(predicate);
    };
    return (<div className='schedule-control-section'>
            <div className='col-lg-9 control-section'>
                <div className='control-wrapper'>
                    <ScheduleComponent cssClass='resource' width='100%' height='650px' selectedDate={new Date(2021, 5, 6)} ref={scheduleObj} eventSettings={{ dataSource: data }}>
                        <ResourcesDirective>
                            <ResourceDirective field='OwnerId' title='Owners' name='Owners' allowMultiple={true} dataSource={resourceData} textField='Text' idField='Id' colorField='Color'/>
                        </ResourcesDirective>
                        <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]}/>
                    </ScheduleComponent>
                </div>
            </div>
            <div className='col-lg-3 property-section'>
                <PropertyPane title='Properties'>
                    <table id="property" title="Resources" className='property-panel-table'>
                        <tbody>
                            <tr>
                                <td>
                                    <CheckBoxComponent ref={ownerOneObj} value='1' id='margaret' cssClass='margaret' checked={true} label='Margaret' change={onChange}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <CheckBoxComponent ref={ownerTwoObj} value='2' id='robert' cssClass='robert' checked={true} label='Robert' change={onChange}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <CheckBoxComponent ref={ownerThreeObj} value='3' id='laura' cssClass='laura' checked={true} label='Laura' change={onChange}/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </PropertyPane>
            </div>
        </div>);
};
export default SchedulePage;
