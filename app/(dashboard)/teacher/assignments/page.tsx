'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogClose, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AssignmentCard from '@/components/AssignmentCard';
import AssignmentForm from '@/components/AssignmentForm';
import AssignmentViewModal from '@/components/AssignmentViewModal';

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [viewing, setViewing] = useState<any>(null);

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/assignments');
      if (res.ok) setAssignments(await res.json());
    } catch {
      toast.error('Failed to load assignments');
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAssignments(); }, [fetchAssignments]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this assignment? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/assignments/${id}`, { method: 'DELETE' });
      if (res.ok) { toast.success('Assignment deleted'); fetchAssignments(); }
      else toast.error('Failed to delete');
    } catch { toast.error('Failed to delete'); }
  };

  const openCreate = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (a: any) => { setEditing(a); setDialogOpen(true); };
  const handleSuccess = () => {
    setDialogOpen(false);
    toast.success(editing ? 'Assignment updated successfully' : 'Assignment created successfully');
    fetchAssignments();
  };

  return (
    <div>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Assignments</h1>
          <p className='text-base text-gray-500 mt-1'>Create and manage assignments for your students</p>
        </div>
        <Button
          onClick={openCreate}
          className='h-11 px-5 gap-2 bg-black hover:bg-gray-900 text-white font-semibold text-sm'
        >
          <Plus className='h-4 w-4' /> New Assignment
        </Button>
      </div>

      {loading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {[1, 2, 3].map(i => (
            <div key={i} className='h-64 rounded-xl bg-gray-100 animate-pulse' />
          ))}
        </div>
      ) : assignments.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-24 text-center'>
          <h3 className='text-lg font-bold text-gray-800 mb-1'>No assignments yet</h3>
          <p className='text-sm text-gray-500 mb-6 max-w-xs'>Click "New Assignment" to create your first assignment for students.</p>
          <Button onClick={openCreate} className='h-11 px-5 gap-2 bg-black hover:bg-gray-900 text-white text-sm'>
            <Plus className='h-4 w-4' /> Create First Assignment
          </Button>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {assignments.map(a => (
            <AssignmentCard
              key={a._id}
              assignment={a}
              role='teacher'
              onView={() => setViewing(a)}
              onEdit={() => openEdit(a)}
              onDelete={() => handleDelete(a._id)}
            />
          ))}
        </div>
      )}

      {viewing && (
        <AssignmentViewModal assignment={viewing} onClose={() => setViewing(null)} />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className='w-[95vw] sm:max-w-3xl max-h-[82vh] overflow-y-auto p-0 gap-0' showCloseButton={false}>
          <div className='sticky top-0 z-10 flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100'>
            <div>
              <DialogTitle className='text-lg font-extrabold text-gray-900'>
                {editing ? 'Edit Assignment' : 'New Assignment'}
              </DialogTitle>
              <p className='text-sm text-gray-400 mt-0.5'>
                {editing ? 'Update the details and questions below' : 'Fill in the details and add your questions'}
              </p>
            </div>
            <DialogClose className='flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors'>
              <X className='h-4 w-4' />
            </DialogClose>
          </div>
          <div className='px-8 py-6'>
            <AssignmentForm key={editing?._id ?? 'new'} initial={editing} onSuccess={handleSuccess} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
