import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from '../loading-service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-loading',
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrl: './loading.scss'
})
export class Loading  implements OnInit{
 isLoading$: Observable<boolean>;

  constructor(private loadingService: LoadingService) {
    this.isLoading$ = this.loadingService.loading$;
  }

  ngOnInit(): void {}
}
