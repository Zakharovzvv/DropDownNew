function dropDownItemTemplate(items, id) {
  const itemTemplate = items.map(item => {
    return `
    <li class="item ${id === item.id ? 'selected' : ''}" data-id="${item.id}">${item.value}</li>
  `
  }).join('')
  return `<ul> ${itemTemplate}  </ul>`
}

function dropDownTemplate(items, {value = '', id = 0}) {
  const text = value ? "value=" + value : 'placeholder="Choose value"'
  return `
        <input class="dropdown-input" id="input" ${text} type="text">
        <i class="fas fa-caret-down" data-element="down-icon"></i>
        <div class="dropdown-list" id="dropdown-list">
            
            ${dropDownItemTemplate(items, id)}
          
        </div>
 `
}

class DropDown {
  constructor(selector, props) {
    this.$el = document.querySelector(selector)
    this.props = props
    this.selectedId = props.selectedId
    this.filtered=false

    this.#render()
    this.#setup()
  }

  get selected() {
    const res = this.props.data.find(item => item.id === this.selectedId)
    return res ? res : {value: '', id: 0}
  }

  #render() {
    this.$el.insertAdjacentHTML('afterbegin', dropDownTemplate(this.props.data, this.selected))
  }

  #setup() {
    this.onKeyupHandler = this.onKeyupHandler.bind(this)
    this.onClickHandler = this.onClickHandler.bind(this)
    this.$el.addEventListener('click', this.onClickHandler)
    this.$el.addEventListener('keyup', this.onKeyupHandler)
    this.$input = this.$el.querySelector('#input');
    this.$dropDownList = this.$el.querySelector('#dropdown-list');
    this.$shevron = this.$el.querySelector('[data-element="down-icon"]');
  }

  #updateDropDownList(items) {
    this.$dropDownList.innerHTML = ''
    this.$dropDownList.insertAdjacentHTML('afterbegin', dropDownItemTemplate(items, 0))
  }

  onKeyupHandler({target}) {
    const filteredItems = this.props.data.filter(item => item.value.toLowerCase().includes(target.value.toLowerCase()))
    this.#updateDropDownList(filteredItems)
    this.filtered=true
  }

  onClickHandler({target}) {
    const el = target.dataset
    if (el.element) {
      //  this.open()
      this.#toggleClass()
    } else if (el.id) {
      this.selectedId = target.dataset.id
      //this.$input.value=this.selected.value
      this.$input.value = target.innerHTML
      this.$el.querySelectorAll('[data-id]').forEach(el => el.classList.remove('selected'))
      target.classList.add('selected')
      this.#toggleClass()
    }
    if (this.filtered) {
      this.#updateDropDownList(this.props.data)
      this.filtered = false
    }
  }

  #toggleClass() {
    this.$el.classList.toggle('open')
    this.$shevron.classList.toggle('fa-caret-down')
    this.$shevron.classList.toggle('fa-caret-up')
  }

  open() {
    this.#toggleClass()
  }

  close() {
    this.#toggleClass()
  }

  destroy() {
    this.$el.removeEventListener(this.onClickHandler)
    this.$el.innerHTML = ''
  }

}

export default DropDown
