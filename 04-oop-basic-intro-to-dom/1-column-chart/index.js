export default class ColumnChart {
    element;
    chartHeight = 50;
    subElements = {};

    constructor({
      data = [],
      label = '',
      link = '',
      value = 0,
      formatHeading = value => value
    } = {}) {
      this.label = label;
      this.link = link;
      this.data = data;
      this.value = value;
      this.formatHeading = formatHeading;
      
      this.createElement();
      this.createSubElements();
    }

    getColumnProps() {
      const maxValue = Math.max(...this.data);
      const scale = 50 / maxValue;
      
      return this.data.map(item => {
        return {
          percent: (item / maxValue * 100).toFixed(0) + '%',
          value: String(Math.floor(item * scale))
        };
      });
    }

    createSubElements() {
      this.element.querySelectorAll('[data-element]').forEach(element => {
        this.subElements[element.dataset.element] = element;
      });
    }

    update(newData) {
      this.data = newData;
      this.value = newData.reduce((a, b) => a + b, 0);
      this.subElements.body.innerHTML = this.createChartItemsTemplate();
      this.subElements.header.textContent = this.formatHeading(this.value);
      this.updateLoading();
    }

    remove() {
      this.element.remove();
    }

    destroy() {
      this.remove();
    }

    createChartLinkTemplate() {
      return this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : '';
    }

    createChartItemsTemplate() {
      return this.getColumnProps()
                .map(data => `<div style="--value: ${data.value}" data-tooltip="${data.percent}"></div>`)
                .join('');
    }

    updateLoading() {
      const loading = 'column-chart_loading';

      if (this.data.length == 0) {
        this.element.classList.add(loading);
      }
      else {
        this.element.classList.remove(loading);
      }
    }

    createTemplate() {
      return `
        <div class="column-chart" style="--chart-height: 50">
            <div class="column-chart__title">
                ${this.label}
                ${this.createChartLinkTemplate()}
            </div>
            <div class="column-chart__container">
                <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
                <div data-element="body" class="column-chart__chart">
                    ${this.createChartItemsTemplate()}
                </div>
            </div>
        </div>
        `;
    }

    createElement() {
      const newElement = document.createElement('div');
      newElement.innerHTML = this.createTemplate();
      
      this.element = newElement.firstElementChild;

      this.updateLoading();
    }
}
