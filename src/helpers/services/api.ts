import {UsersList} from "../../common/dto/Users-list";
import {Roles} from "../../common/data/roles-enum";
import {UserDto} from "../../common/dto/User";
  export  const fakeAPIload = new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulating a successful response
            resolve("");
        }, 3000); // 3 seconds
    });

export const loadUserDataToLocalStorage = () => {
    if (!localStorage.getItem('app-user')) {
        localStorage.setItem('app-user', btoa(JSON.stringify(UsersList)));
        console.log('Userlist loaded to localstorage')
    }
};

export const getLoadedUserList = (): UserDto[] => {
    const userListString = localStorage.getItem("app-user");
    if (!userListString) {
        return [];
    }

    try {
        const decodedUserListString = atob(userListString);
        const userList = JSON.parse(decodedUserListString) as UserDto[];
        return userList;
    } catch (error) {
        console.error("Error parsing user list from localStorage", error);
        return [];
    }
};
export const getAllTeacher = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(getLoadedUserList().filter((user) => user.role.toLowerCase() === Roles.TEACHER.toLowerCase()));
    }, 3000); // 3 seconds
});


export const getAllStudent = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(getLoadedUserList().filter(user => user.role.toLowerCase() === Roles.STUDENT.toLowerCase()));
    }, 3000); // 3 seconds
});

export const signInUser = (email:string, password:string) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = getLoadedUserList().find(user => user.username === email && user.password === password);
            if (user) {
                resolve(user);
            } else {
                reject("User not found or incorrect credentials");
            }
        }, 3000); // 3 seconds delay to simulate async operation
    });
};


export const createStudent = (student:any) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const loadedData = getLoadedUserList();
                loadedData.push(student);
                localStorage.setItem('app-user', btoa(JSON.stringify(loadedData)));
                resolve(student);
            } catch (error) {
                reject("Failed to create student");
            }
        }, 3000);
    });
};
export const createTeacher = (teacher: any) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const loadedData = getLoadedUserList();
                loadedData.push(teacher);
                localStorage.setItem('app-user', btoa(JSON.stringify(loadedData)));
                resolve(teacher);
            } catch (error) {
                reject("Failed to create teacher");
            }
        }, 3000); // 3 seconds delay to simulate async operation
    });
};

