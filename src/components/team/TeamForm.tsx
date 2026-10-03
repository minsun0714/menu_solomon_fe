import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MAX_TEAM_DESCRIPTION_LENGTH, MAX_TEAM_NAME_LENGTH } from '@/constants/team'
import type { TeamRequest } from '@/types/team'

type TeamFormProps = {
  initialValue?: TeamRequest
  submitLabel: string
  isSubmitting: boolean
  onSubmit: (request: TeamRequest) => void
}

export function TeamForm({ initialValue, submitLabel, isSubmitting, onSubmit }: TeamFormProps) {
  const [name, setName] = useState(initialValue?.name ?? '')
  const [description, setDescription] = useState(initialValue?.description ?? '')
  const isValid = name.trim().length > 0

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (isValid) onSubmit({ name: name.trim(), description: description.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="team-name">팀 이름</Label>
        <Input id="team-name" value={name} maxLength={MAX_TEAM_NAME_LENGTH} placeholder="예: 플랫폼개발팀" onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="team-description">팀 소개</Label>
        <Textarea id="team-description" value={description} maxLength={MAX_TEAM_DESCRIPTION_LENGTH} placeholder="팀을 간단히 소개해 주세요." onChange={(e) => setDescription(e.target.value)} />
      </div>
      <Button type="submit" disabled={!isValid || isSubmitting}>
        {isSubmitting ? '저장 중...' : submitLabel}
      </Button>
    </form>
  )
}
