import { createRoot } from 'react-dom/client';
import './schedule.css';
import { useAuth, useUser } from "@clerk/clerk-react";
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import { Day, Week, WorkWeek, Month, Agenda, ScheduleComponent, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';

const SchedulePage = () => {
    const { isLoaded, isSignedIn } = useUser();
    const { user } = useUser();
    const userId = user?.id;

    const scheduleObj = useRef(null);
    const [scheduleData, setScheduleData] = useState([]);
    // Authentication
    
    
    // Fetch data from the backend API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/schedule`, {
                    credentials: "include", // Ensure the request includes authentication cookies
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const result = await response.json();
                setScheduleData(result.result);
            } catch (error) {
                console.error('Error fetching schedule data:', error);
            }
        };
    
        fetchData();
    }, []);

    const onEventRendered = (args) => {
        const categoryColor = args.data.CategoryColor;
        if (!args.element || !categoryColor) return;

        if (scheduleObj.current.currentView === 'Agenda') {
            args.element.firstChild.style.borderLeftColor = categoryColor;
        } else {
            args.element.style.backgroundColor = categoryColor;
        }
    };

    const onActionComplete = async (args) => {
        if (args.requestType === 'eventCreated' || args.requestType === 'eventChanged' || args.requestType === 'eventRemoved') {
            const added = args.addedRecords || [];
            const changed = args.changedRecords || [];
            const deleted = args.deletedRecords || [];
            
            const requestBody = {
                userId: userId, // Replace with the actual userId, possibly obtained from a login or session
                added: added.map(event => ({
                    Id: event.Id,
                    Subject: event.Subject,
                    StartTime: event.StartTime,
                    EndTime: event.EndTime,
                    CategoryColor: event.CategoryColor,
                })),
                changed: changed.map(event => ({
                    Id: event.Id,
                    Subject: event.Subject,
                    StartTime: event.StartTime,
                    EndTime: event.EndTime,
                    CategoryColor: event.CategoryColor,
                })),
                deleted: deleted.map(event => ({
                    Id: event.Id,
                }))
            };

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/schedule/batch`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody),
                });

                if (response.ok) {
                    console.log('Batch operation successful');
                } else {
                    console.error('Batch operation failed', await response.text());
                }
            } catch (error) {
                console.error('Error performing batch operation:', error);
            }
        }
    };
    
    if (!isLoaded) {
        return <div className="">Loading...</div>;
      }
    
      if (isLoaded && !isSignedIn) {
        return <div className="">You should login!</div>;
      }

    return (
        <div className='schedule-control-section'>
            <div className='col-lg-12 control-section'>
                <div className='control-wrapper'>
                    <ScheduleComponent
                        width='100%'
                        height='650px'
                        selectedDate={new Date()}
                        ref={scheduleObj}
                        eventSettings={{ dataSource: scheduleData }}
                        eventRendered={onEventRendered}
                        actionComplete={onActionComplete}
                    >
                        <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
                    </ScheduleComponent>
                </div>
            </div>
        </div>
    );
};

export default SchedulePage;
