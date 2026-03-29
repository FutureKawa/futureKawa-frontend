import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pay',
  standalone: true,
  templateUrl: './pays.html',
  styleUrl: './pays.scss'
})
export class PaysComponent implements OnInit {

  codePays: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.codePays = params.get('code');
    });
  }
}
