import { EmailLog } from './src/app/models/email-log'
import { Student } from './src/app/models/student'

export interface EmailReceiver {
    id: number
    emailLodId: number
    studentId: number
    subject: string
    body: string
    created_at?: Date
    updated_at?: Date
    status?: 'active' | 'inactive'
    emailLog: EmailLog
    student: Array<Student>
}
