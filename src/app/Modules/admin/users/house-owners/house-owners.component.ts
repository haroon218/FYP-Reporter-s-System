import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { TableModule, Table } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}
@Component({
  selector: 'app-house-owners',
  imports: [
     CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        // ConfirmDialogModule,
        CheckboxModule
  ],
  templateUrl: './house-owners.component.html',
  styleUrl: './house-owners.component.scss'
})
export class HouseOwnersComponent {
  
    productDialog: boolean = false;
  
    products = signal<any[]>([]);
  
    product!: any;
  
    selectedProducts!: any[] | null;
  
    submitted: boolean = false;
  
    statuses!: any[];
    pizza:any
  
    @ViewChild('dt') dt!: Table;
  
    exportColumns!: ExportColumn[];
  
    cols!: Column[];
  
    constructor(
       
    ) {}
  
    dataAry:any = [  
    {
        id: '1000',
        name: 'Rana',
        block_name: 'Main Boulevard',
        area: '5 Marla',
        plot_no: 62,
       
    },
      {
        id: '1001',
        name: 'Haroon',
        block_name: 'Main Boulevard',
        area: '10 Marla',
        plot_no: 63,
       
    },
    {
      id: '1002',
      name: 'Ali',
      block_name: 'Main Boulevard',
      area: '5 Marla',
      plot_no: 64,
     
  },
  {
    id: '1003',
    name: 'Ahmad',
    block_name: 'Main Boulevard',
    area: '5 Marla',
    plot_no: 65,
   
},
    ]
  
    exportCSV() {
        this.dt.exportCSV();
    }
  
    ngOnInit() {
        this.loadDemoData();
    }
  
    loadDemoData() {
        this.products.set(this.dataAry);
        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
  
        this.cols = [
            { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            { field: 'name', header: 'Name' },
            { field: 'image', header: 'Image' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' }
        ];
  
        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }
  
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
  
    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }
  
    editProduct(product: any) {
        this.product = { ...product };
        this.productDialog = true;
    }
  
    deleteSelectedProducts() {
        // this.confirmationService.confirm({
        //     message: 'Are you sure you want to delete the selected products?',
        //     header: 'Confirm',
        //     icon: 'pi pi-exclamation-triangle',
        //     accept: () => {
        //         this.products.set(this.products().filter((val) => !this.selectedProducts?.includes(val)));
        //         this.selectedProducts = null;
        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Successful',
        //             detail: 'Products Deleted',
        //             life: 3000
        //         });
        //     }
        // });
    }
  
    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }
  
    deleteProduct(product: any) {
        // this.confirmationService.confirm({
        //     message: 'Are you sure you want to delete ' + product.name + '?',
        //     header: 'Confirm',
        //     icon: 'pi pi-exclamation-triangle',
        //     accept: () => {
        //         this.products.set(this.products().filter((val) => val.id !== product.id));
        //         this.product = {};
        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Successful',
        //             detail: 'Product Deleted',
        //             life: 3000
        //         });
        //     }
        // });
    }
  
    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products().length; i++) {
            if (this.products()[i].id === id) {
                index = i;
                break;
            }
        }
  
        return index;
    }
  
    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
  
    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
    }
  
    saveProduct() {
        // this.submitted = true;
        // let _products = this.products();
        // if (this.product.name?.trim()) {
        //     if (this.product.id) {
        //         _products[this.findIndexById(this.product.id)] = this.product;
        //         this.products.set([..._products]);
        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Successful',
        //             detail: 'Product Updated',
        //             life: 3000
        //         });
        //     } else {
        //         this.product.id = this.createId();
        //         this.product.image = 'product-placeholder.svg';
        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Successful',
        //             detail: 'Product Created',
        //             life: 3000
        //         });
        //         this.products.set([..._products, this.product]);
        //     }
  
        //     this.productDialog = false;
        //     this.product = {};
        // }
    }
  }
  
  
