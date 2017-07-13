# Tips and Tricks

## Working with Git and GitHub
Working with Git and GitHub might seem tricky at first, but I promise it gets much easier as you gain experience with it! Here are some basic instructions, but please feel free to ping the #datasci-sba channel if you need help.

[Clone this repo locally](https://help.github.com/articles/cloning-a-repository/)
```
$ git clone <your-repo>
$ cd <this-repo's-name>
```
Create a feature branch:
```
$ git checkout -b <feature-branch>
```
Do some work:  
```
$ vim <some-files>
```
When you're ready, commit, [merge any upstream changes](https://help.github.com/articles/merging-an-upstream-repository-into-your-fork/), [deal with conflicts](https://help.github.com/articles/resolving-a-merge-conflict-from-the-command-line/), and push your branch
```
$ git add <edited-files>
$ git commit -m 'my awesome feature'
$ git push
```
[Create a Pull Request](https://help.github.com/articles/creating-a-pull-request/) from your pushed branch (compare branch) to the master branch

## Querying tables in our database
See https://github.com/sfbrigade/datasci-sba/blob/master/notebooks/query_sql_template.ipynb as an example to query tables in the database

## Educational Resources

- Git/GitHub - Free online course at Udacity: https://classroom.udacity.com/courses/ud775

- HTML and CSS - Free online course at Udacity: https://classroom.udacity.com/courses/ud304

- D3 Visualization Package - One-time free course at Rithm School (via meetup.com): https://www.meetup.com/meetup-code-your-face-off/events/241379532/

| Previous | 
|:---------|
| [Development Environment](./02_development_environment.md) |
