import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/axios';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- SORTABLE ITEM COMPONENT ---
const SortableItem = ({ id, application }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-white rounded-md shadow-sm border border-canvas-border mb-3 hover:border-teal-500 hover:shadow-md transition-all group"
    >
      {/* Drag handle area */}
      <div
        {...listeners}
        className="p-4 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-body-sm flex-shrink-0">
            {application.full_name?.charAt(0) || application.email?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0">
            <h4 className="text-body-md font-semibold text-ink-700 truncate">
              {application.full_name || application.email}
            </h4>
            <p className="text-body-sm text-ink-400 truncate">{application.headline || 'Kandidat'}</p>
          </div>
        </div>
        <div className="text-xs text-ink-300 mt-3 pt-2 border-t border-gray-100 flex justify-between">
          <span>{new Date(application.applied_at).toLocaleDateString()}</span>
        </div>
      </div>
      {/* Clickable link to detail */}
      <Link
        to={`/dashboard/applications/${application.id}`}
        className="block px-4 pb-2 text-xs text-teal-600 hover:text-teal-800 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
      >
        Lihat Detail →
      </Link>
    </div>
  );
};

// --- DROPPABLE COLUMN COMPONENT ---
const Column = ({ stage, applications }) => {
  return (
    <div className="bg-gray-50 flex-shrink-0 w-80 rounded-lg border border-canvas-border flex flex-col max-h-full">
      <div className="p-3 border-b border-canvas-border flex items-center justify-between">
        <h3 className="font-semibold text-ink-700">{stage.name}</h3>
        <span className="bg-white text-ink-500 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
          {applications.length}
        </span>
      </div>
      
      <div className="p-3 flex-1 overflow-y-auto">
        <SortableContext 
          id={stage.id} 
          items={applications.map(a => a.id)} 
          strategy={verticalListSortingStrategy}
        >
          {applications.map(app => (
            <SortableItem key={app.id} id={app.id} application={app} />
          ))}
          {applications.length === 0 && (
            <div className="h-20 border-2 border-dashed border-gray-200 rounded-md flex items-center justify-center text-ink-300 text-body-sm">
              Tarik kandidat ke sini
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};

// --- MAIN PIPELINE COMPONENT ---
const JobPipeline = () => {
  const { id: jobId } = useParams();
  const [stages, setStages] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);
  
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    fetchPipeline();
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const { data } = await api.get(`/dashboard/jobs/${jobId}`);
      setJob(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPipeline = async () => {
    try {
      const { data } = await api.get(`/dashboard/jobs/${jobId}/pipeline`);
      setStages(data.data.stages);
      setApplications(data.data.applications);
    } catch (err) {
      console.error(err);
      alert('Gagal memuat pipeline');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;

    const applicationId = active.id;
    const overId = over.id;

    // Find what stage the item was dropped on
    // over.id can be either a stageId (if dropped on empty column) or an applicationId (if dropped on another item)
    let newStageId = overId;
    
    const isOverApplication = applications.some(a => a.id === overId);
    if (isOverApplication) {
      const overApp = applications.find(a => a.id === overId);
      newStageId = overApp.current_stage_id;
    }

    const app = applications.find(a => a.id === applicationId);
    if (!app || app.current_stage_id === newStageId) return;

    // Optimistic UI Update
    setApplications(prev => prev.map(a => 
      a.id === applicationId ? { ...a, current_stage_id: newStageId } : a
    ));

    try {
      await api.patch(`/dashboard/applications/${applicationId}/stage`, { newStageId });
    } catch (err) {
      console.error(err);
      alert('Gagal memindahkan kandidat');
      fetchPipeline(); // revert
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-ink-500">Memuat pipeline...</div>;
  }

  const activeApp = activeId ? applications.find(a => a.id === activeId) : null;

  // Separate stages (normal vs rejected/withdrawn)
  const mainStages = stages.filter(s => !['rejected', 'withdrawn'].includes(s.anchor_type));
  const otherStages = stages.filter(s => ['rejected', 'withdrawn'].includes(s.anchor_type));

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col">
      <header className="h-16 bg-white border-b border-canvas-border flex items-center justify-between px-8 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/jobs" className="text-ink-400 hover:text-ink-700">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
          <div>
            <h1 className="text-body-md font-semibold text-ink-700">Pipeline: {job?.title || 'Memuat...'}</h1>
            <p className="text-xs text-ink-400">{applications.length} Kandidat Pelamar</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-x-auto flex gap-6 items-start h-[calc(100vh-64px)]">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {mainStages.map(stage => (
            <Column 
              key={stage.id} 
              stage={stage} 
              applications={applications.filter(a => a.current_stage_id === stage.id)} 
            />
          ))}

          {otherStages.length > 0 && (
            <div className="flex gap-6 border-l-2 border-dashed border-gray-300 pl-6 h-full">
              {otherStages.map(stage => (
                <Column 
                  key={stage.id} 
                  stage={stage} 
                  applications={applications.filter(a => a.current_stage_id === stage.id)} 
                />
              ))}
            </div>
          )}

          <DragOverlay>
            {activeApp ? (
              <div className="bg-white p-4 rounded-md shadow-lg border border-teal-500 opacity-90 rotate-3">
                <div className="text-body-md font-semibold text-ink-700 truncate">{activeApp.full_name || activeApp.email}</div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
};

export default JobPipeline;
