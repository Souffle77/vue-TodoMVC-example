import 'todomvc-app-css/index.css'
import Vue from 'vue'

//定義footer的篩選標籤 function
var filters = {
	all(todos) {
		return todos
	},

	active(todos) {
		return todos.filter(function(todo) {
			return !todo.completed
		})
	},

	completed(todos) {
		return todos.filter(function(todo) {
			return todo.completed
		})
	}
}

let app = new Vue({
	el:'.todoapp',
	data: {
		title: 'TodoMVC',//頁面標題
		newTodo:'',//輸入框的位置，初始值為空
		todos:[{
			content: 'test',
			completed: false
		}],
		editedTodo: null, 
		visibility: 'all'
	},
	
	computed: {
		
		//剩餘多少
		remain() {
			return filters.active(this.todos).length
		},
		//是不是全選
		allDone: {
			get() { //下面的值全選的時候，上面的值也要有反應(顏色變亮)
				return this.remain === 0 //如果沒有剩餘表示已經全選了 
			},
			set(value) { //我這個值發生變化的時候(全選的時候)，下面的值也要發生變化
				this.todos.forEach(function(todo) {
					todo.completed = value
				})
			}
		},
		//根據todos的狀態來進行篩選
		filteredTodos() {
			//根據上面的function name = filters 裡面的屬性名稱進行篩選
			return filters[this.visibility](this.todos)
		}
	},
	
	methods: {
		addTodo(e) {
			//  在vue應用進程中的方法內部可以通過this來訪問當前應用進程的上的data中的成員
			if(!this.newTodo) {
				return
			}
			this.todos.push({
				content: this.newTodo,
				completed: false
			}) //在輸入框輸入什麼值就帶什麼值
			this.newTodo = '' //輸入完後，輸入框要還原成'空'的狀態
		},
		removeTodo(index) {
			this.todos.splice(index,1) // 刪除當前值
		},
		editTodo(todo) {
			//開始編輯的時候揪需要暫存內容
			this.editCache = todo.content
			this.editedTodo = todo
		},
		doneEdit(todo,index) {
			this.editedTodo = null //相當於我已經編輯完畢了
			if(!todo.content){//如果沒有內容就是刪除，無法輸入空白
				this.removeTodo(index)
			}
		},
		cancelEdit(todo) { // 取消編輯，還原原本的內容，需要暫存內容
			this.editedTodo = null
			todo.content = this.editCache

		},
		removeCompleted() {
			this.todos = filters.active(this.todos)
		}
	},
	directives: {
		focus(el, value) { //傳遞元素和本身的值
			if(value) {
				el.focus()
			}
		}
	}
})


function hashChange() {
	let visibility = location.hash.replace(/#\/?/,'') 
	//替換名稱，使用正則表達式替換。原 #/ -> #\/?
	if(filters[visibility]){
		app.visibility = visibility
	}else{
		//如果是不是我們定義的名稱，就還原為空。
		location.hash = ''
		app.visibility = 'all'
	}
}

//全局的監聽
window.addEventListener('hashchange', hashChange)















