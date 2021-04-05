export default function ({ store, redirect }) {
    if (!localStorage.getItem('access_token')) {
        return redirect("/login")
    }
}