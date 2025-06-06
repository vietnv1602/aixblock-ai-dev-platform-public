import { FastifyBaseLogger } from 'fastify'
import { smtpEmailSender } from './smtp-email-sender'

export type EmailSender = {
    send: (args: SendArgs) => Promise<void>
}

const getEmailSenderInstance = (log: FastifyBaseLogger): EmailSender => {
    return smtpEmailSender(log);
    // const env = system.get(AppSystemProp.ENVIRONMENT)

    // if (env === ApEnvironment.PRODUCTION) {
    //     return smtpEmailSender(log)
    // }

    // return logEmailSender(log)
}

export const emailSender = (log: FastifyBaseLogger) => getEmailSenderInstance(log)

type BaseEmailTemplateData<Name extends string, Vars extends Record<string, string>> = {
    name: Name
    vars: Vars
}

type InvitationEmailTemplateData = BaseEmailTemplateData<'invitation-email', {
    projectOrPlatformName: string
    role: string
    setupLink: string
}>

type QuotaEmailTemplateData = BaseEmailTemplateData<'quota-50' | 'quota-90' | 'quota-100', {
    resetDate: string
}>

type ResetPasswordEmailTemplateData = BaseEmailTemplateData<'reset-password', {
    setupLink: string
}>

type VerifyEmailTemplateData = BaseEmailTemplateData<'verify-email', {
    setupLink: string
}>

type IssueCreatedTemplateData = BaseEmailTemplateData<'issue-created', {
    issueUrl: string
    flowName: string
    isIssue: string
    createdAt: string
}>

type IssuesReminderTemplateData = BaseEmailTemplateData<'issues-reminder', {
    issuesUrl: string
    issues: string
    issuesCount: string
    projectName: string
}>

type TriggerFailureThresholdTemplateData = BaseEmailTemplateData<'trigger-failure', {
    flowName: string
    projectName: string
}>

type RegisterEmailTemplateData = BaseEmailTemplateData<'register', {
    email: string
    username: string
    password: string
}>

export type EmailTemplateData =
  | InvitationEmailTemplateData
  | QuotaEmailTemplateData
  | ResetPasswordEmailTemplateData
  | VerifyEmailTemplateData
  | IssueCreatedTemplateData
  | IssuesReminderTemplateData
  | TriggerFailureThresholdTemplateData
  | RegisterEmailTemplateData

type SendArgs = {
    emails: string[]
    platformId: string | undefined
    templateData: EmailTemplateData
}
