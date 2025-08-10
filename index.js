     document.addEventListener('DOMContentLoaded', function() {

            const studentForm = document.getElementById('studentForm');
            const submitBtn = document.getElementById('submitBtn');
            const resetBtn = document.getElementById('resetBtn');
            const recordsTableBody = document.getElementById('recordsTableBody');
            const noRecordsDiv = document.getElementById('noRecords');
            const scrollTopBtn = document.getElementById('scrollTopBtn');
            const recordsTableContainer = document.getElementById('recordsTableContainer');
            
            // Form input fields
            const fields = {
                recordId: document.getElementById('recordId'),
                studentId: document.getElementById('studentId'),
                studentName: document.getElementById('studentName'),
                email: document.getElementById('email'),
                contact: document.getElementById('contact'),
                course: document.getElementById('course')
            };
             // Error messages
            const errors = {
                studentIdError: document.getElementById('studentIdError'),
                studentNameError: document.getElementById('studentNameError'),
                emailError: document.getElementById('emailError'),
                contactError: document.getElementById('contactError'),
                courseError: document.getElementById('courseError')
            };
            
            // Load records from localStorage when page loads
            let studentRecords = JSON.parse(localStorage.getItem('studentRecords')) || [];
            
            // Scroll to top button
            scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            // Show/hide scroll to top button
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    scrollTopBtn.classList.add('visible');
                } else {
                    scrollTopBtn.classList.remove('visible');
                }
            });
            
            // Event listener for form submission
            studentForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validate form inputs
                if (!validateForm()) {
                    return;
                }
                
                // Get form data
                const studentData = {
                    id: fields.studentId.value.trim(),
                    name: fields.studentName.value.trim(),
                    email: fields.email.value.trim(),
                    contact: fields.contact.value.trim(),
                    course: fields.course.value.trim()
                };
                 // Check if we're editing an existing record
                if (fields.recordId.value) {
                    // Find and update the record
                    const recordIndex = studentRecords.findIndex(r => r.id === fields.recordId.value);
                    if (recordIndex !== -1) {
                        studentRecords[recordIndex] = {
                            ...studentRecords[recordIndex],
                            ...studentData
                        };
                    }
                } else {
                    // Add new record
                    studentRecords.push(studentData);
                }
                
                // Save to localStorage
                localStorage.setItem('studentRecords', JSON.stringify(studentRecords));
                
                // Update the UI
                renderStudentRecords();
                
                // Reset the form
                resetForm();
            });
            
            // Event listener for reset button
            resetBtn.addEventListener('click', resetForm);
            
            // Validate form inputs
            function validateForm() {
                let isValid = true;
                
                // Reset error messages
                Object.values(errors).forEach(error => {
                    error.style.display = 'none';
                });
                
                // Validate Student ID (numeric only)
                if (!fields.studentId.value.trim() || !/^\d+$/.test(fields.studentId.value.trim())) {
                    errors.studentIdError.style.display = 'block';
                    isValid = false;
                }
                
                // Validate Student Name (alphabetic characters only)
                if (!fields.studentName.value.trim() || !/^[a-zA-Z ]+$/.test(fields.studentName.value.trim())) {
                    errors.studentNameError.style.display = 'block';
                    isValid = false;
                }
                
                // Validate Email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!fields.email.value.trim() || !emailRegex.test(fields.email.value.trim())) {
                    errors.emailError.style.display = 'block';
                    isValid = false;
                }
                
                // Validate Contact (10 digits minimum)
                if (!fields.contact.value.trim() || !/^\d{10,}$/.test(fields.contact.value.trim())) {
                    errors.contactError.style.display = 'block';
                    isValid = false;
                }
                
                // Validate Course
                if (!fields.course.value) {
                    errors.courseError.style.display = 'block';
                    isValid = false;
                }
                
                return isValid;
            }
            
            // Reset form
            function resetForm() {
                studentForm.reset();
                fields.recordId.value = '';
                submitBtn.textContent = 'Add Student';
                
                // Reset error messages
                Object.values(errors).forEach(error => {
                    error.style.display = 'none';
                });
            }
            // Render student records in the table
            function renderStudentRecords() {
                recordsTableBody.innerHTML = '';
                
                if (studentRecords.length === 0) {
                    noRecordsDiv.style.display = 'block';
                    return;
                }
                
                noRecordsDiv.style.display = 'none';
                
                studentRecords.forEach(student => {
                    const row = document.createElement('tr');
                    
                    row.innerHTML = `
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${student.email}</td>
                        <td>${student.contact}</td>
                        <td>${student.course}</td>
                        <td class="action-cell">
                            <button class="btn-secondary edit-btn" data-id="${student.id}">Edit</button>
                            <button class="btn-danger delete-btn" data-id="${student.id}">Delete</button>
                        </td>
                    `;
                    
                    recordsTableBody.appendChild(row);
                });
                
                // Add event listeners to edit buttons
                document.querySelectorAll('.edit-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const studentId = this.getAttribute('data-id');
                        editStudentRecord(studentId);
                    });
                });
                
                // Add event listeners to delete buttons
                document.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const studentId = this.getAttribute('data-id');
                        deleteStudentRecord(studentId);
                    });
                });
                
                // Set dynamic scrollbar
                setScrollbar();
            }
            
            // Edit student record
            function editStudentRecord(studentId) {
                const student = studentRecords.find(s => s.id === studentId);
                
                if (student) {
                    fields.recordId.value = student.id;
                    fields.studentId.value = student.id;
                    fields.studentName.value = student.name;
                    fields.email.value = student.email;
                    fields.contact.value = student.contact;
                    fields.course.value = student.course;
                    
                    submitBtn.textContent = 'Update Record';
                    
                    // Scroll to form
                    studentForm.scrollIntoView({ behavior: 'smooth' });
                }
            }
            
            // Delete student record
            function deleteStudentRecord(studentId) {
                if (confirm('Are you sure you want to delete this student record?')) {
                    studentRecords = studentRecords.filter(s => s.id !== studentId);
                    localStorage.setItem('studentRecords', JSON.stringify(studentRecords));
                    renderStudentRecords();
                }
            }
            
            // Set dynamic scrollbar based on content height
            function setScrollbar() {
                const tableHeight = recordsTableBody.offsetHeight;
                const containerHeight = recordsTableContainer.offsetHeight;
                
                if (tableHeight > containerHeight) {
                    recordsTableContainer.style.overflowY = 'scroll';
                } else {
                    recordsTableContainer.style.overflowY = 'auto';
                }
            }
            
            // Initial render
            renderStudentRecords();
            
        
            fields.studentId.addEventListener('input', function() {
                this.value = this.value.replace(/[^0-9]/g, '');
            });
            
            fields.contact.addEventListener('input', function() {
                this.value = this.value.replace(/[^0-9]/g, '');
            });
        });
    