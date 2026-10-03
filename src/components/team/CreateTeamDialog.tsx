import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TeamForm } from './TeamForm'
import type { TeamRequest } from '@/types/team'

type CreateTeamDialogProps = {
  isCreating: boolean
  onCreate: (request: TeamRequest, onCreated: () => void) => void
}

export function CreateTeamDialog({ isCreating, onCreate }: CreateTeamDialogProps) {
  const [open, setOpen] = useState(false)
  const handleSubmit = (request: TeamRequest) => onCreate(request, () => setOpen(false))

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus /> 팀 만들기
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 팀 만들기</DialogTitle>
            <DialogDescription>팀을 만들고 초대 링크로 동료를 초대하세요.</DialogDescription>
          </DialogHeader>
          <TeamForm submitLabel="팀 만들기" isSubmitting={isCreating} onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
    </>
  )
}
