import { data } from './data';
import { Component, ViewChild, ViewEncapsulation, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { AccumulationChartComponent, AccumulationChart, IAccLoadedEventArgs, AccumulationTheme } from '@syncfusion/ej2-angular-charts';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { MatTableDataSource, MatSort } from '@angular/material';

/**
 * Sample for Pie chart
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  trendings: Trending[] = [] as Trending[];
  content: string = "";
  displayedColumns: string[] = ['pageName', 'postLink', 'like', 'comment', 'share'];

  constructor() {
  }

  ngOnInit() {
  }

  onEnter() {
    console.log(this.content);
    this.getTrending(this.content);
  }

  getTrending(content) {
    let patternAll = /<div class="_6-e5"(.*?)class="fbEmuTracking">/g;
    let matches = content.match(patternAll);
    this.trendings = [];
    matches.forEach(content => {
      let trending = {} as Trending;
      trending.pageName = this.getPage(content).name;
      trending.pageLink = this.getPage(content).link;
      trending.like = this.getLike(content);
      trending.comment = this.getComment(content);
      trending.share = this.getShare(content);
      trending.postLink = this.getPostLink(content);
      this.trendings.push(trending);
    })
    this.trendings.sort((a, b) => b.like - a.like);
    this.dataSource = new MatTableDataSource(this.trendings);
    this.dataSource.sort = this.sort;
  }

  getPage(content: string) {
    let pattern = /<a class="_7gyi"(.*?)<\/a>/;
    let match = content.match(pattern) ? content.match(pattern).toString() : "";
    let name = match.match(/>(.*)<\/a>/) ? match.match(/>(.*)<\/a>/)[1] : "";
    let link = match.match(/href=\"([^"]+)"/) ? match.match(/href=\"([^"]+)"/)[1] : "";
    return { name, link };
  }

  getLike(content: string): number {
    let pattern = /<span class="_81hb">(.*?)<\/span>/;
    let match = content.match(pattern) ? content.match(pattern)[1] : "";
    return this.renderNumber(match);
  }

  getComment(content: string): number {
    let pattern = /<a class="_3hg- _42ft"(.*?)<\/a>/;
    let match = content.match(pattern) ? content.match(pattern).toString() : "";
    let commentMatch = match.match(/>(.*)<\/a>/) ? match.match(/>(.*)<\/a>/)[1] : "";
    commentMatch = commentMatch.replace('bình luận', "").trim();
    return this.renderNumber(commentMatch);
  }

  getShare(content: string) {
    let pattern = /<a ajaxify="\/ajax\/shares\/view(.*?)<\/a>/;
    let match = content.match(pattern) ? content.match(pattern).toString() : "";
    let shareMatch = match.match(/>(.*)<\/a>/) ? match.match(/>(.*)<\/a>/)[1] : "";
    shareMatch = shareMatch.replace('lượt chia sẻ', "").trim()
    return this.renderNumber(shareMatch);
  }

  getPostLink(content: string): string {
    let pattern = /<span class="_6-cm">(.*?)<\/span>/;
    let match = content.match(pattern) ? content.match(pattern)[1].toString() : "";
    let postLink = match.match(/href=\"([^"]+)"/) ? match.match(/href=\"([^"]+)"/)[1] : "";
    return "https://facebook.com" + postLink;
  }

  renderNumber(match: string) {
    let like = match.replace(",", ".");
    if (like.indexOf("K") > -1) {
      like = like.replace("K", "");
      return Number(like) * 1000
    }
    return Number(like)
  }

}


interface Trending {
  pageName: string,
  pageLink: string,
  content: string,
  like: number,
  share: number,
  comment: number,
  postLink: string
}
