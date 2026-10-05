import { useState, type FormEvent } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/auth/useAuth'
import { useUpdateNicknameMutation } from '@/hooks/auth/useUpdateNicknameMutation'
import { TeamForm } from './TeamForm'
import type { TeamRequest } from '@/types/team'

const MIN_NICKNAME_LENGTH = 2
const MAX_NICKNAME_LENGTH = 12

type CreateTeamDialogProps = {
  isCreating: boolean
  triggerClassName?: string
  onCreate: (request: TeamRequest, onCreated: () => void) => void
}

export function CreateTeamDialog({ isCreating, triggerClassName, onCreate }: CreateTeamDialogProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [teamRequest, setTeamRequest] = useState<TeamRequest | null>(null)
  const [nickname, setNickname] = useState('')
  const { user } = useAuth()
  const { mutate: updateNickname, isPending: isUpdatingNickname } = useUpdateNicknameMutation()
  const trimmedNickname = nickname.trim()
  const isNicknameValid = trimmedNickname.length >= MIN_NICKNAME_LENGTH && trimmedNickname.length <= MAX_NICKNAME_LENGTH
  const isSubmitting = isUpdatingNickname || isCreating

  const reset = () => {
    setStep(1)
    setTeamRequest(null)
    setNickname('')
  }
  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) reset()
  }
  const handleTeamSubmit = (request: TeamRequest) => {
    setTeamRequest(request)
    setNickname(user?.nickname ?? '')
    setStep(2)
  }
  const createTeam = () => {
    if (!teamRequest) return
    onCreate(teamRequest, () => handleOpenChange(false))
  }
  const handleProfileSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!isNicknameValid || !teamRequest) return
    if (trimmedNickname === user?.nickname) createTeam()
    else updateNickname(trimmedNickname, { onSuccess: createTeam })
  }

  return (
    <>
      <Button className={triggerClassName} onClick={() => setOpen(true)}>
        <Plus /> 팀 만들기
      </Button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between gap-3 pr-6">
              <DialogTitle>새 팀 만들기</DialogTitle>
              <span className="text-xs font-medium text-muted-foreground">{step} / 2</span>
            </div>
            <DialogDescription>
              {step === 1 ? '팀 정보를 입력해 주세요.' : '팀에서 표시할 내 이름을 확인해 주세요.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2" aria-hidden="true">
            <span className="h-1 rounded-full bg-primary" />
            <span className={`h-1 rounded-full ${step === 2 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
          {step === 1 ? (
            <TeamForm
              initialValue={teamRequest ?? undefined}
              submitLabel="다음"
              isSubmitting={false}
              onSubmit={handleTeamSubmit}
            />
          ) : (
            <form className="grid gap-5" onSubmit={handleProfileSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="creator-nickname">
                  내 닉네임 <span className="text-destructive" aria-hidden="true">*</span>
                </Label>
                <Input
                  id="creator-nickname"
                  required
                  autoFocus
                  minLength={MIN_NICKNAME_LENGTH}
                  maxLength={MAX_NICKNAME_LENGTH}
                  value={nickname}
                  placeholder="사용할 닉네임"
                  onChange={(event) => setNickname(event.target.value)}
                />
                <div className="flex justify-between gap-3 text-xs text-muted-foreground">
                  <span>이 이름은 참여 중인 모든 팀에서 사용됩니다.</span>
                  <span className="shrink-0">{nickname.length}/{MAX_NICKNAME_LENGTH}</span>
                </div>
                {nickname.length > 0 && !isNicknameValid && (
                  <p className="text-xs text-destructive">닉네임은 {MIN_NICKNAME_LENGTH}~{MAX_NICKNAME_LENGTH}자로 입력해 주세요.</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => setStep(1)}>
                  <ArrowLeft /> 이전
                </Button>
                <Button type="submit" className="flex-1" disabled={!isNicknameValid || isSubmitting}>
                  {isUpdatingNickname ? '닉네임 변경 중...' : isCreating ? '팀 생성 중...' : '팀 만들기'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
