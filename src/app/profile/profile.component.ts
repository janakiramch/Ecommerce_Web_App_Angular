import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../pagination/pagination.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  constructor(private apiService: ApiService, private router: Router) {}

  userInfo: any = null;
  error: any = null;
  currentPage: number = 1;
  itemsPerPage: number = 3;

  ngOnInit(): void {
    this.apiService.getLoggedInUserInfo().subscribe({
      next: (response) => {
        console.log(response);
        this.userInfo = response.user;
      },
      error: (error) => {
        console.log(error);
        this.error = error?.error?.message || 'Unable to Fetch User Info';
      },
    });
  }

  handleAddressClick(): void {
    const urlPathToNavigateTo = this.userInfo.address
      ? '/edit-address'
      : '/add-address';
    this.router.navigate([urlPathToNavigateTo]);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  get paginatedOrders(): any[] {
    if (!this.userInfo?.orderItemList) return [];
    else {
      return this.userInfo.orderItemList.slice(
        (this.currentPage - 1) * this.itemsPerPage,
        this.currentPage * this.itemsPerPage
      );
    }
  }

  get totalPages(): number {
    return Math.ceil(
      (this.userInfo?.orderItemList?.length || 0) / this.itemsPerPage
    );
  }
}
