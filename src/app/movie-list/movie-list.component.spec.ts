import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MovieListComponent} from './movie-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import fetchMock from 'fetch-mock';
import {ChangeDetectionStrategy} from '@angular/core';


describe('MovieListComponent', () => {
  let component: MovieListComponent;
  let fixture: ComponentFixture<MovieListComponent>;
  let input;
  let searchBtn;
  let compiled;

  const pushValue = async (value) => {
    input.value = value;
    input.dispatchEvent(new Event('change'));
    input.dispatchEvent(new Event('input'));
    searchBtn.click();
    await fixture.whenStable();
  };

  const getByTestId = (testId: string) => {
    return compiled.querySelector(`[data-test-id="${testId}"]`);
  };



  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [MovieListComponent]
    })
      .overrideComponent(MovieListComponent, {
        set: {changeDetection: ChangeDetectionStrategy.Default}
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieListComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
    input = getByTestId('app-input');
    searchBtn = getByTestId('submit-button');
    fixture.detectChanges();
  });

  afterEach(fetchMock.reset);

  it('Should render the Initial UI', async () => {
    expect(input.value.trim()).toBeFalsy();
    expect(searchBtn.innerHTML).toBe('Search');
    expect(getByTestId('no-result')).toBeNull();
    expect(getByTestId('movieList')).toBeNull();
  });

  it('Should show No Results Found when there are no results from API', async (done) => {
    const url = 'https://jsonmock.hackerrank.com/api/movies?Year=1996';
    fetchMock.getOnce(url, JSON.stringify({page: 1, per_page: 10, total: 0, total_pages: 0, data: []}));
    await pushValue('1996');
    await fixture.whenStable();
    setTimeout(() => {
      fixture.detectChanges();
      fixture.whenRenderingDone();
      expect(fetchMock.called('https://jsonmock.hackerrank.com/api/movies?Year=1996')).toBeTrue();
      expect(getByTestId('movieList')).toBeNull();
      expect(getByTestId('no-result')).toBeTruthy();
      expect(getByTestId('no-result').innerHTML.trim()).toEqual('No Results Found');
      done();
    }, 500);
  });

  it('Should search and render the movies - 1', async (done) => {
    const url = 'https://jsonmock.hackerrank.com/api/movies?Year=2015';
    fetchMock.getOnce(url, JSON.stringify({
      page: 1,
      per_page: 10,
      total: 0,
      total_pages: 0,
      data: [{
        Title: 'The Death of Spiderman',
        Year: 2015,
        imdbID: 'tt5921428'
      }, {Title: 'Beat Feet: Scotty Smileys Blind Journey to Ironman', Year: 2015, imdbID: 'tt5117146'}]
    }));
    await pushValue('2015');
    await fixture.whenStable();
    setTimeout(() => {
      fixture.detectChanges();
      fixture.whenRenderingDone();
      expect(fetchMock.called('https://jsonmock.hackerrank.com/api/movies?Year=2015')).toBeTrue();
      const movieList = getByTestId('movieList');
      expect(movieList.children.length).toEqual(2);
      expect(movieList.children[0].innerHTML.trim()).toEqual('The Death of Spiderman');
      expect(movieList.children[1].innerHTML.trim()).toEqual('Beat Feet: Scotty Smileys Blind Journey to Ironman');
      expect(getByTestId('no-result')).toBeNull();
      done();
    }, 500);
  });

  it('Should search and render the movies - 2', async (done) => {
    const url = 'https://jsonmock.hackerrank.com/api/movies?Year=2010';
    fetchMock.getOnce(url, JSON.stringify({
      page: 1,
      per_page: 10,
      total: 0,
      total_pages: 0,
      data: [{
        Title: 'A Mind Devoid of Happiness or: The Maze',
        Year: 2010,
        imdbID: 'tt5037380'
      }, {
        Title: 'Lard and the Peace Maze',
        Year: 2010,
        imdbID: 'tt5046522'
      }, {
        Title: 'Macau Stories III: City Maze',
        Year: 2010,
        imdbID: 'tt5603106'
      }, {Title: 'Harry Price: Ghost Hunter', Year: 2010, imdbID: 'tt4974584'}, {
        Title: 'Harry Snowman',
        Year: 2010,
        imdbID: 'tt2898306'
      }]
    }));
    await pushValue('2010');
    await fixture.whenStable();
    setTimeout(() => {
      fixture.detectChanges();
      fixture.whenRenderingDone();
      const movieList = getByTestId('movieList');
      expect(fetchMock.called('https://jsonmock.hackerrank.com/api/movies?Year=2010')).toBeTrue();
      expect(movieList.children.length).toEqual(5);
      expect(movieList.children[0].innerHTML.trim()).toEqual('A Mind Devoid of Happiness or: The Maze');
      expect(movieList.children[1].innerHTML.trim()).toEqual('Lard and the Peace Maze');
      expect(movieList.children[2].innerHTML.trim()).toEqual('Macau Stories III: City Maze');
      expect(movieList.children[3].innerHTML.trim()).toEqual('Harry Price: Ghost Hunter');
      expect(movieList.children[4].innerHTML.trim()).toEqual('Harry Snowman');
      expect(getByTestId('no-result')).toBeNull();
      done();
    }, 500);
  });
});
