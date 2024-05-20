

export interface UserDto {
    id: string,
    username: string,
    password: string,
    role: string,
    profile: {
        national_no: string,
        title: string,
        firstname: string,
        lastname: string,
        dob: any,
        teacher_no: string,
        student_no: string,
        salary: number
    }
}

