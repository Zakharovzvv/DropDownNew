function dropDownItemTemplate(items, id) {
  const itemTemplate = items.map(item => {
    return `
    <li class="item ${id===item.id? 'selected':''}" data-id="${item.id}">${item.value}</li>
  `
  }).join('')
  return itemTemplate
}

function dropDownTemplate(items, {value='',id=0}) {
  const text=value?"value="+value:'placeholder="Choose value"'
  return `
        <input class="dropdown-input" id="input" ${text} type="text">
        <i class="fas fa-caret-down" data-element="down-icon"></i>
        <div class="dropdown-list">
            <ul>
            ${dropDownItemTemplate(items,id)}
           </ul>
        </div>
 `
}

class DropDown {
  constructor(selector, props) {
    this.$el = document.querySelector(selector)
    this.props = props
    this.selectedId = props.selectedId

    this.#render()
    this.#setup()
  }

  get selected() {
    const res=this.props.data.find(item => item.id === this.selectedId)
    return res?res:{value:'',id:0}
  }

  #render() {
    this.$el.insertAdjacentHTML('afterbegin', dropDownTemplate(this.props.data, this.selected))
  }

  #setup() {
    this.onClickHandler = this.onClickHandler.bind(this)
    this.$el.addEventListener('click', this.onClickHandler)
    this.$input = this.$el.querySelector('#input');
    this.$shevron = this.$el.querySelector('[data-element="down-icon"]');
  }

  onClickHandler({target}) {
    const el = target.dataset
    if (el.element) {
      //  this.open()
      this.#toggleClass()
    } else if (el.id) {
      this.selectedId = target.dataset.id
      //this.$input.vaue=this.selected.value
      this.$input.value = target.innerHTML
      this.$el.querySelectorAll('[data-id]').forEach(el => el.classList.remove('selected'))
      target.classList.add('selected')
      this.#toggleClass()
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
  destroy(){
    this.$el.removeEventListener(this.onClickHandler)
    this.$el.innerHTML=''
  }

}

export default DropDown
