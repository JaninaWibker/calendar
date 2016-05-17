/** @jsx kalista().dom */
'use strict';

let __date = new Date();
store().create('state', {
  view: 0,
  date: {
    day: __date.getDate(),
    month: __date.getMonth(),
    year: __date.getFullYear()
  },
  today: {
    day: __date.getDate(),
    month: __date.getMonth(),
    year: __date.getFullYear()
  },
  nav: {
    open: false,
    title: 'Day/Week/Month',
    content: ['Day', 'Week', 'Month', 'Today']
  },
  events: [{ date: { year: 2016, month: 4, day: 14, hour: 14 }, title: 'three' }, { date: { year: 2016, month: 4, day: 14, hour: 12 }, title: 'one' }, { date: { year: 2016, month: 4, day: 14, hour: 13 }, title: 'two' }]
});
let components = {
  header_tree: state => {
    let curr;
    if (state.view === 0) {
      curr = state.date.day + "." + (state.date.month + 1) + "." + state.date.year;
    } else if (state.view === 1) {
      curr = state.date.month + 1 + "." + state.date.year;
    } else if (state.view === 2) {
      curr = state.date.month + 1 + "." + state.date.year;
    }
    return kalista().dom(
      'div',
      { 'class': 'header' },
      kalista().dom(
        'div',
        { 'class': 'header-menu-icon', onclick: 'interaction().toggleNav(\'state\')' },
        kalista().dom(
          'i',
          { 'class': 'material-icons' },
          'menu'
        )
      ),
      kalista().dom(
        'div',
        { 'class': 'header-section' },
        curr + " | " + state.nav.content[state.view]
      )
    );
  },
  nav_tree: state => {
    return kalista().dom(
      'div',
      { 'class': "nav-container " + (state.nav.open ? '' : 'hidden') },
      kalista().dom(
        'div',
        { 'class': 'nav' },
        kalista().dom(
          'div',
          { 'class': 'nav-close', onclick: 'interaction().toggleNav(\'state\')' },
          kalista().dom(
            'i',
            { 'class': 'material-icons' },
            'close'
          )
        ),
        kalista().dom('div', { 'class': 'nav-header-img' }),
        kalista().dom(
          'div',
          { 'class': 'nav-header-title' },
          state.nav.title
        ),
        components.navItems_tree(state)
      )
    );
  },
  navItems_tree: state => {
    let children = [];
    for (let i = 0; i < state.nav.content.length; i++) {
      children.push(kalista().dom(
        'div',
        { 'class': 'nav-item', onclick: 'interaction().changeView(this)' },
        state.nav.content[i]
      ));
    }
    return { 'tag': 'div', 'prop': { 'class': 'nav-items' }, 'children': children };
  },
  view_tree: state => {
    let view;
    if (state.view === 0) {
      view = components.day_tree(state);
    } else if (state.view === 1) {
      view = components.week_tree(state);
    } else if (state.view === 2) {
      view = components.month_tree(state);
    }
    return kalista().dom(
      'div',
      { 'class': 'main' },
      components.day_tree(state),
      components.week_tree(state),
      components.month_tree(state)
    );
  },
  main_tree: state => {
    return kalista().dom(
      'div',
      null,
      components.header_tree(state),
      components.nav_tree(state),
      components.view_tree(state),
      components.buttons()
    );
  },
  day_tree: state => {
    let evt = events(state, state.date),
        children = [];
    for (let i = 0; i < 24; i++) {
      let _i = i,
          _event = false,
          _title = '';
      for (let e = 0; e < evt.length; e++) {
        if (i === evt[e].hour) {
          _event = true;
          _title = evt[e].title;
        }
      }
      if (i === 24) {
        _i = 0;
      }
      children.push(kalista().dom(
        'div',
        { 'class': 'day-container' },
        kalista().dom(
          'div',
          { 'class': 'day-time' },
          _i,
          ':00'
        ),
        kalista().dom(
          'div',
          { 'class': 'day-event', event: _event },
          _title
        )
      ));
    }
    return { 'tag': 'div', 'prop': { 'class': 'day-view ', 'hide': state.view === 0 || state.view === 3 ? false : true }, 'children': children };
  },
  week_tree: state => {
    let date = new Date(state.date.year, state.date.month, state.date.day);
    while (date.getDay() !== 1) {
      date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
    }
    let dates = [date, new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1), new Date(date.getFullYear(), date.getMonth(), date.getDate() + 2), new Date(date.getFullYear(), date.getMonth(), date.getDate() + 3), new Date(date.getFullYear(), date.getMonth(), date.getDate() + 4), new Date(date.getFullYear(), date.getMonth(), date.getDate() + 5), new Date(date.getFullYear(), date.getMonth(), date.getDate() + 6), new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7)];
    let titles = [];
    let isToday = [];
    for (let i = 0; i < dates.length; i++) {
      if (dates[i].getDate() === state.today.day && dates[i].getMonth() === state.today.month && dates[i].getFullYear() === state.today.year) {
        isToday[i] = true;
      } else {
        isToday[i] = false;
      }
      let title = [];
      let evt = events(state, { 'year': dates[i].getFullYear(), 'month': dates[i].getMonth(), 'day': dates[i].getDate() });
      for (let e = 0; e < evt.length; e++) {
        title.push(kalista().dom(
          'div',
          { 'class': 'event-badge' },
          evt[e].title
        ));
      }
      titles.push({ 'tag': 'div', 'children': title });
    }
    return kalista().dom(
      'div',
      { 'class': "week-view ", hide: state.view === 1 ? false : true },
      kalista().dom(
        'table',
        null,
        kalista().dom(
          'tr',
          null,
          kalista().dom(
            'th',
            null,
            'M'
          ),
          kalista().dom(
            'th',
            null,
            'T'
          ),
          kalista().dom(
            'th',
            null,
            'W'
          ),
          kalista().dom(
            'th',
            null,
            'T'
          ),
          kalista().dom(
            'th',
            null,
            'F'
          ),
          kalista().dom(
            'th',
            null,
            'S'
          ),
          kalista().dom(
            'th',
            null,
            'S'
          )
        ),
        kalista().dom(
          'tr',
          { 'class': 'isWeek' },
          kalista().dom(
            'td',
            { is_today: isToday[0], week_date: true, onclick: 'interaction().viewDay(this)' },
            dates[0].getDate() + "." + (dates[0].getMonth() + 1)
          ),
          kalista().dom(
            'td',
            { is_today: isToday[1], week_date: true, onclick: 'interaction().viewDay(this)' },
            dates[1].getDate() + "." + (dates[1].getMonth() + 1)
          ),
          kalista().dom(
            'td',
            { is_today: isToday[2], week_date: true, onclick: 'interaction().viewDay(this)' },
            dates[2].getDate() + "." + (dates[2].getMonth() + 1)
          ),
          kalista().dom(
            'td',
            { is_today: isToday[3], week_date: true, onclick: 'interaction().viewDay(this)' },
            dates[3].getDate() + "." + (dates[3].getMonth() + 1)
          ),
          kalista().dom(
            'td',
            { is_today: isToday[4], week_date: true, onclick: 'interaction().viewDay(this)' },
            dates[4].getDate() + "." + (dates[4].getMonth() + 1)
          ),
          kalista().dom(
            'td',
            { is_today: isToday[5], week_date: true, onclick: 'interaction().viewDay(this)' },
            dates[5].getDate() + "." + (dates[5].getMonth() + 1)
          ),
          kalista().dom(
            'td',
            { is_today: isToday[6], week_date: true, onclick: 'interaction().viewDay(this)' },
            dates[6].getDate() + "." + (dates[6].getMonth() + 1)
          )
        ),
        kalista().dom(
          'tr',
          null,
          kalista().dom(
            'td',
            { event: titles[0] ? true : false },
            titles[0]
          ),
          kalista().dom(
            'td',
            { event: titles[1] ? true : false },
            titles[1]
          ),
          kalista().dom(
            'td',
            { event: titles[2] ? true : false },
            titles[2]
          ),
          kalista().dom(
            'td',
            { event: titles[3] ? true : false },
            titles[3]
          ),
          kalista().dom(
            'td',
            { event: titles[4] ? true : false },
            titles[4]
          ),
          kalista().dom(
            'td',
            { event: titles[5] ? true : false },
            titles[5]
          ),
          kalista().dom(
            'td',
            { event: titles[6] ? true : false },
            titles[6]
          )
        )
      )
    );
  },
  month_tree: state => {
    let weeks = getMonthData(state.date.year, state.date.month);
    let obj = [];
    let isToday = false;
    for (let i = 0; i < weeks.length; i++) {
      let children = [];
      for (let x = 0; x < weeks[i].length; x++) {
        let l_data;
        if (weeks[i][x] === undefined) {
          l_data = '';
        } else {
          l_data = weeks[i][x];
        }
        if (l_data === state.today.day && state.date.month === state.today.month && state.date.year === state.today.year) {
          isToday = true;
        } else {
          isToday = false;
        }
        children.push(kalista().dom(
          'td',
          { 'class': 'month-item', is_today: isToday, onclick: 'interaction().viewDay(this, ' + state.date.month + ')' },
          l_data
        ));
      }
      obj.push({ 'tag': 'tr', 'prop': { 'class': 'month-row' }, 'children': children });
    }
    let m_data = { 'tag': 'table', 'prop': { 'class': '' }, 'children': obj };
    return kalista().dom(
      'div',
      { 'class': 'month-view', hide: state.view === 2 ? false : true },
      kalista().dom(
        'table',
        null,
        kalista().dom(
          'tr',
          null,
          kalista().dom(
            'th',
            null,
            'M'
          ),
          kalista().dom(
            'th',
            null,
            'T'
          ),
          kalista().dom(
            'th',
            null,
            'W'
          ),
          kalista().dom(
            'th',
            null,
            'T'
          ),
          kalista().dom(
            'th',
            null,
            'F'
          ),
          kalista().dom(
            'th',
            null,
            'S'
          ),
          kalista().dom(
            'th',
            null,
            'S'
          )
        )
      ),
      m_data
    );
  },
  buttons: state => {
    return kalista().dom(
      'div',
      { 'class': 'btn-container' },
      kalista().dom(
        'div',
        { 'class': 'btn-previous btn-fab', onclick: 'interaction().previous()' },
        kalista().dom(
          'i',
          { 'class': 'material-icons' },
          'keyboard_arrow_left'
        )
      ),
      kalista().dom(
        'div',
        { 'class': 'btn-next btn-fab', onclick: 'interaction().next()' },
        kalista().dom(
          'i',
          { 'class': 'material-icons' },
          'keyboard_arrow_right'
        )
      ),
      kalista().dom(
        'div',
        { 'class': 'btn-add btn-fab', onclick: 'interaction().add()' },
        kalista().dom(
          'i',
          { 'class': 'material-icons' },
          'add'
        )
      )
    );
  },
  add_screen: state => {
    let add_menu = kalista().dom('div', { 'class': 'add_menu' });
  }
};

let interaction = () => {
  return {
    toggleNav: state => {
      if (store().get(state).nav.open) {
        let state = store().get('state');
        state.nav.open = false;
        store().change('state', state);
      } else {
        let state = store().get('state');
        state.nav.open = true;
        store().change('state', state);
      }
    },
    changeView: that => {
      let state = store().get('state');
      if (that.innerHTML === 'Today') {
        state.date = { 'year': new Date().getFullYear(), 'month': new Date().getMonth(), 'day': new Date().getDate() };
        state.view = 0;
      } else {
        state.view = state.nav.content.indexOf(that.innerHTML);
      }
      state.nav.open = false;
      store().change('state', state);
    },
    viewDay: (that, month) => {
      let state = store().get('state'),
          year = state.date.year,
          day_month;
      if (month) {
        day_month = [that.innerHTML, month + 1];
      } else {
        day_month = that.innerHTML.split(".");
      }
      state.date = { 'year': year, 'month': parseInt(day_month[1]) - 1, 'day': parseInt(day_month[0]) };
      state.view = 0;
      store().change('state', state);
    },
    previous: () => {
      let state = store().get('state'),
          _date;
      switch (state.view) {
        case 0:
          _date = new Date(state.date.year, state.date.month, state.date.day - 1);
          state.date.day = _date.getDate();
          state.date.month = _date.getMonth();
          state.date.year = _date.getFullYear();
          store().change('state', state);
          break;
        case 1:
          _date = new Date(state.date.year, state.date.month, state.date.day - 7);
          state.date.day = _date.getDate();
          state.date.month = _date.getMonth();
          state.date.year = _date.getFullYear();
          store().change('state', state);
          break;
        case 2:
          _date = new Date(state.date.year, state.date.month - 1, state.date.day);
          state.date.day = _date.getDate();
          state.date.month = _date.getMonth();
          state.date.year = _date.getFullYear();
          store().change('state', state);
          break;
        default:
          console.log('error');
      }
    },
    next: () => {
      let state = store().get('state'),
          _date;
      switch (state.view) {
        case 0:
          _date = new Date(state.date.year, state.date.month, state.date.day + 1);
          state.date.day = _date.getDate();
          state.date.month = _date.getMonth();
          state.date.year = _date.getFullYear();
          store().change('state', state);
          break;
        case 1:
          _date = new Date(state.date.year, state.date.month, state.date.day + 7);
          state.date.day = _date.getDate();
          state.date.month = _date.getMonth();
          state.date.year = _date.getFullYear();
          store().change('state', state);
          break;
        case 2:
          _date = new Date(state.date.year, state.date.month + 1, state.date.day);
          state.date.day = _date.getDate();
          state.date.month = _date.getMonth();
          state.date.year = _date.getFullYear();
          store().change('state', state);
          break;
        default:
          console.log('error');
      }
    },
    add: () => {
      console.log('add');
    }
  };
};
let events = (state, date) => {
  let _events = [];
  for (let i = 0; i < state.events.length; i++) {
    let date2 = state.events[i].date;
    if (date.year === date2.year && date.month === date2.month && date.day === date2.day) {
      _events.push({
        'hour': date2.hour,
        'title': state.events[i].title
      });
    }
  }
  return _events;
};
let getMonthData = (year, month) => {
  let date = new Date(year, month, 1),
      date2,
      days = [],
      weeks = [],
      curr_week = 0;
  while (date.getMonth() === month) {
    date2 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    let day = date.getDay() - 2;
    if (day === -2) {
      day = 5;
    } else if (day === -1) {
      day = 6;
    }
    days.push({ 'date': date2.getDate(), 'day': day });
  }
  for (let i = 0; i < days.length; i++) {
    if (!weeks[curr_week]) {
      weeks[curr_week] = [];
    }
    if (days[i].day < Math.floor(i - curr_week * 7)) {
      curr_week++;
      if (!weeks[curr_week]) {
        weeks[curr_week] = [];
      }
      weeks[curr_week][days[i].day] = days[i].date;
    } else {
      weeks[curr_week][days[i].day] = days[i].date;
    }
  }
  return weeks;
};

let sortEvents = () => {
  let state = store().get('state');
  state.events.sort((a, b) => {
    return a.date.hour > b.date.hour ? 1 : b.hour > a.hour ? -1 : 0;
  });
  store().change('state', state);
};
let oldRenderTree;
let newRenderTree;
let renderTarget = $('body')[0];

let render = state => {
  oldRenderTree = components.main_tree(state);
  renderTarget.replaceChild(kalista().render(oldRenderTree), renderTarget.firstChild);
};
let diff = state => {
  newRenderTree = components.main_tree(state);
  console.log(oldRenderTree);
  kalista().diff(oldRenderTree, newRenderTree, '', 0, renderTarget.firstChild);
  oldRenderTree = newRenderTree;
};
$('.header')[0].remove();
sortEvents();
render(store().get('state'));

store().subscribe('state', diff);
