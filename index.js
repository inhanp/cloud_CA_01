class Student {
    constructor(name, enrolled = false) {
        this.name = name;
        this.enrolled = enrolled;
    }

    notify(message, callback) {
        console.log(this.name + " received message : " + message);
        //something slow might happen here
        callback();
    }

    // slow step 1 -- verifying that the student is not enrolled --> error, user
    isEnrolledSlow(delay, callback) {
        setTimeout( () => {
            if (this.enrolled)
                callback("Already enrolled", null);
            else
                callback(null, this);
        }, delay);
    }
}

const students = Array();

students.push(new Student("NameA"), new Student("NameB"),
    new Student("NameC"), new Student("NameD"));

//class that defines our data, equipped with a toString method.
class Course {
    constructor(name = "CS0000", enrolled = 0, capacity = 25, seats, instructor, interstedStudents) {
        this.name = name;
        this.enrolled = enrolled;
        this.capacity = capacity;
        this.seats = seats;
        this.instructor = instructor;
        this.interstedStudents = interstedStudents
    }

    //Add type in the TS version
    toString() {
        return this.name + "Enrolled : " + this.enrolled + "Capacity : " + this.capacity +
            "Seats : " + this.id + "Instructor : " + this.instructor;
    }

    //slow step 2 -- verifying that the class has sufficient space --> errorm course
    checkSpaceSlow(delay, callback) {
        setTimeout( () => {
            if(this.capacity > this.enrolled)
                callback(null, this);
            else
                callback('Class is full', null);
        }, delay);
    }
}

const course1 = new Course('CS2114', 100, 105, '0001', 'Esakia', students);

console.log(course1.toString());

//fields are directly accessible.
console.log(course1.name);

//Another way to create an object except this one is in the form of a JSON
//JSON objects can have method declarations in the body that can reference other
//fields using this.
const course2 = {
    name:'CS2104',
    enrolled:51,
    capacity:52,
    seats:55,
    instructor:'Esakia',
    interstedStudents: students,
    toString: function () {
        return this.name + " Enrolled :" + this.enrolled + "Capacity : " + this.capacity +
            "ID : " + this.id + "Instructor : " + this.instructor;
    },
    checkSpaceSlow: function(delay, callback) {
        setTimeout(() => {
            if (this.capacity > this.enrolled)
                callback(null, this);
            else
                callback('Class is full', null);
        }, delay);
    }
}

//This array declaration treats the courses created in a different way equally.
let courses = new Array();
courses.push(course1, course2);

//Accessing fields is the same
console.log(courses[0].name + " " + courses[1].name);

//And the function too
console.log(course2.toString());

function resultOfSearch(result) {
    console.log("Search result is : " + result.name);
}

function slowClassSearch(arrayOfCourses, courseName, callback) {
    setTimeout( () => {
        const result = arrayOfCourses.find(course => course.name === courseName);
        callback(result)
    },);
}

//A verbose way where the callback function is declared with a name
slowClassSearch(courses, 'CS2104', resultOfSearch);

//compact way where the callback function is declared inside
slowClassSearch(courses, 'CS2114', result => {
    console.log("Result inside anonymous function: " + result.name)
});

function slowAddCourse(course, arrayOfCourses, callback) {
    setTimeout( () => {
        //making sure we have a Course and not something else
        if (course instanceof Course) {
            arrayOfCourses.push(course);
            callback(null, arrayOfCourses);
        }
        else
            callback("Error, not a course.", null);
    }, 1000)
}

//Param 1 : Instantiating and passing a wrong Class object
//Param 2 : the array containing courses
//Param 3 : success callback function defined inline
//Param 4 : error callback function defined inline
slowAddCourse({
    seats:3,
    instructor:'Esakia'
}, courses, (error, result) => {
    if (error)
        console.log(error);
    else
        console.log("Course count", result.length)
});

//Param 1 : Instantiating and passing -- seemingly correct -- Class object
//Param 2 : the array containing courses
//Param 3 : success callback function defined inline
//Param 4 : error callback function defined inline
slowAddCourse({
    name:'CS2204',
    enrolled:49,
    capacity:53,
    seats:55,
    instructor:'Esakia',
    interstedStudents: students,
    toString: function(delay, callback) {
        return this.name + " Enrolled : " + this.enrolled + " Capacity : " + this.capacity +
            " ID : " + this.id + " Instructor : " + this.instructor;
    },
    checkSpaceSlow: function(){setTimeout(()=> {
        if(this.capacity>this.enrolled)
            callback(null,this);
        else
            callback('Class is full',null);
    }, delay);}
    }, courses, (error,result) => {
    if(error)
        console.log(error);

    else
        console.log("Course count", result.length)
})

// The output says 'Error not a course' again.
// This happens because our JSON object does not claim to be of type Class.

// Workaround #1: instantiating object with 'class Course' counstructor.
slowAddCourse( new Course('CS2314', 105, 107, 110, 'Esakia')
    , courses, (error,result) => {
        if(error)
            console.log(error);
        else
            console.log("Course count", result.length)
    });

//Workaround #2 : create a JSON that claims to be of type Course
let course4 = Object.assign(Object.create(Course.prototype), {
    name:'CS2304',
    enrolled:49,
    capacity:57,
    seats:60,
    instructor:'Esakia',
    interstedStudents: students,
    toString: function () {
        return this.name + " Enrolled : " + this.enrolled + " Capacity : " + this.capacity +
            " ID : " + this.id + " Instructor : " + this.instructor;
    }
});

slowAddCourse(course4, courses, (error, result) => {
    if (error)
        console.log(error);
    else
        console.log("Course count", result.length)
})

//enrolled -> checkSpaceSlow -> enroll & notify -> increment -> print message

function slowIncrement(delay, course, callback) {
    setTimeout(() => {
        course.enrolled++;

        if (course.capacity === course.enrolled)
            callback(course.name + " is full!", null);
        else
            callback(null, course.name + " has " + (
                course.capacity - course.enrolled
            ) + " seats");
    }, delay);
}

async function slowAddStudent(student, course)

//This function contains callback hell.
function slowAddStudent(delay, student, course, callback) {
    student.isEnrolledSlow(delay, (error, student) => {
        if (error)
            callback(error);
        else if (!course)
            callback("Course is null!");
        else
            course.checkSpaceSlow(delay, (error, course) => {
                if (error)
                    callback(error);
                else {
                    student.notify("You are enrolled in " + course.name, () => {
                        slowIncrement(delay, course, (full, available) => {
                            if (full)
                                callback(full);
                            else
                                callback(available);
                        });
                    })
                }
            })
    })
}

slowAddStudent(1000, students[0], courses[1], message => console.log(message));