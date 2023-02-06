export class ProgressBar {

    static n: number = 3
    static max: number = 10

    static generateProgressBar(percentage: number) {
        const completed: number = Math.round(percentage * this.n);
        const inCompleted: number = ((this.max * this.n) - completed);
        const max = (this.max * this.n);
        let progressBar = ""
        for (let i = 0; i < max; i++) {
            progressBar += (i < completed) ? "█" : "░";
        }

        console.log(progressBar);
        return progressBar;
    }

}
