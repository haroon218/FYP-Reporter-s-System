import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AuthService } from '../../../../../services/auth.service';
import { UserManagementService } from '../../../../../services/user-management.service';
import { AdminModule } from '../../../admin.module';
import { SecureStorageService } from '../../../secure-storage.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule,DialogModule,TableModule, CommonModule, InputTextModule, TagModule, FormsModule,BreadcrumbModule,TranslateModule,
    DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule, AdminModule,RouterModule],  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent {
  @Input() display: boolean = false;
  @Input() selectedEmployee: any;
  @Output() displayChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<any>();
  selectedBranch:any;
  isLoading:boolean=false;
  loadingText:any
  employeeNameToDelete:any
  employeeIdToDelete:any
  delete:boolean=false
  branches:any;
  searchTerm: string = '';
  employees: any[] = [];
    loading: boolean = true;
    currentPage: number = 1;
    perPage: number = 10; // Adjust as needed
    totalRecords: number = 0; // Total records from API
    addEmployeeForm!:FormGroup
  constructor(private useService:UserManagementService,private toastr:ToastrService,private fb:FormBuilder,private companyService: AuthService,private storageService:SecureStorageService,private router:Router) {}

  ngOnInit(): void {
    this.addEmployeeForm = this.fb.group({
      name: ['', Validators.required], // Name field
      mobile: [
        '', 
        [
          Validators.required, 
          Validators.pattern('^[0-9]+$') // Only numbers allowed
        ]
      ], 
      email: ['', [Validators.required, Validators.email]], // Email field
      password: [
        '', 
        [
          Validators.required, 
          Validators.minLength(8) // Minimum length of 8 characters
        ]
      ],
      role: ['', Validators.required],
      admin_name: [''],
      admin_email: ['']
    });
  
    this.loadBranches();
  
  }

  loadEmployees(): void {
    this.loading = true;

    const queryParams: any = {
        per_page: this.perPage,
        page: this.currentPage,
        search: this.searchTerm || undefined, // Only add search if not empty
        branch_id: this.selectedBranch || undefined // Only add branch_id if defined
    };

    this.companyService.getEmployees(queryParams).subscribe({
        next: (response: any) => {
            this.employees = response.data.data;
            this.loading = false;
        },
        error: (error: any) => {
            console.error('Error fetching employees:', error);
            this.loading = false;
        },
    });
}


  navigateToViewList(id: string): void {
    // this.storageService.saveId(id);
    const encryptedId = this.storageService.encryptId(id);
    this.router.navigate(['admin/user-management/view-list',encryptedId]);
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1; // PrimeNG uses 0-based indexing
    this.loadEmployees();
  }


  openDialog() {
    this.display = true;
    this.displayChange.emit(this.display);
  }

  addEmployee(): void {
    if (this.addEmployeeForm.invalid) return;
  
    if (this.selectedEmployee) {
      // Edit mode
      const updatedEmployee = { ...this.selectedEmployee, ...this.addEmployeeForm.value };
      // Call service to update the employee
      this.companyService.updateEmployee(updatedEmployee).subscribe(
        response => {
          // Handle successful update
          this.loadEmployees(); // Reload the employee list
          this.display = false; // Close the dialog
        },
        error => {
          console.error('Error updating employee:', error);
        }
      );
    } else {
      // Add mode
      const newEmployee = this.addEmployeeForm.value;
      // Call service to add the employee
      this.companyService.addEmployee(newEmployee).subscribe(
        response => {
          // Handle successful addition
          this.onSave.emit(this.employees);

          this.display = false; // Close the dialog
        },
        error => {
          console.error('Error adding employee:', error);
        }
      );
    }
  }
  
  onCancel(): void {
    this.display = false;
    this.displayChange.emit(this.display); // Close the dialog
    this.selectedEmployee = null; // Reset selectedEmployee
    this.addEmployeeForm.reset(); // Clear the form
  }
  
  loadBranches(){
    this.useService.getRoles().subscribe({
      next: (response: any) => {
       this.branches=response.data.data
      },
      error: (error: any) => {
      },
    });
  }
  onDelete(id: number, name: string) {
    this.employeeIdToDelete = id;
    this.employeeNameToDelete = name;
    this.delete = true;
  }
  confirmDelete() {
    if (this.employeeIdToDelete !== null) {
      this.isLoading = true; // Start loader
      this.loadingText = 'Deleting...';
      this.companyService.deleteEmployees(this.employeeIdToDelete).subscribe({
        next: (response:any) => {
          this.toastr.success(response.message, 'Success');

          this.employees = this.employees.filter((group:any) => group.id !== this.employeeIdToDelete);
          // this.totalRecords = this.groups.length;
          this.delete = false;
          this.isLoading = false;
          this.loadingText = ''; // Stop loader
          this.employeeIdToDelete = null;
          this.employeeNameToDelete = null;
        },
        error: (error:any) => {
          this.loadingText = '';
          this.isLoading = false; // Stop loader even if there's an error
        }
      });
    }
  }

  // Method to handle the cancellation of deletion
  onDeleteCancel() {
    this.delete = false;
    this.employeeIdToDelete = null;
    this.employeeNameToDelete = null;
  }
  openEditDialog(employee: any): void {
    this.selectedEmployee = employee;
    debugger // Store the employee to edit
    this.addEmployeeForm.patchValue(employee);
    this.patchBranch(employee.branches) // Populate the form with employee data
    this.display = true; // Show the dialog
  }
  patchBranch(branch:any): void {
    if (branch && branch.length > 0) {
      const firstBranch = branch[0];  // Take the first branch object
      this.addEmployeeForm.patchValue({
        branch_id: firstBranch.branch_id  // Patch branch_id to the form
      });
    }
  }
  
}


