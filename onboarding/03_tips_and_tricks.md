# Tips and Tricks

## Working with Git and GitHub
Working with Git and GitHub might seem tricky at first, but I promise it gets much easier as you gain experience with it! Here are some basic instructions, but please feel free to ping the #datasci-sba channel if you need help.

[Clone this repo locally](https://help.github.com/articles/cloning-a-repository/)
```
$ git clone https://github.com/sfbrigade/datasci-sba.git
$ cd datasci-sba
```
Create your own branch to start work:
```
$ git checkout -b <your-branch-name>
```
To change between branches: 
```
$ git checkout <branch-name>
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

## Using the Jupyter Notebook
To access the Jupyter notebook, type ```$ jupyter notebook``` on Mac or ```$ jupyter notebook --no-browser``` on Windows. It will say "The Jupyter terminal is running at http://localhost:8888/sometoken." Copy the link and paste it in your browser. 

If you have a Windows computer, you may see an error message about a "dead kernel." [The fix](http://sdsawtelle.github.io/blog/output/bash-and-ipython-on-ubuntu-for-windows.html) is to type in Bash the following: ```$ conda install -c jzuhone zeromq=4.1.dev0```. To learn more about why this works, [click here.](http://sdsawtelle.github.io/blog/output/bash-and-ipython-on-ubuntu-for-windows.html)

## Querying tables in our database
See https://github.com/sfbrigade/datasci-sba/blob/master/notebooks/query_sql_template.ipynb as an example to query tables in the database

## Educational Resources

- Git/GitHub - Free online course at Udacity: https://classroom.udacity.com/courses/ud775

- HTML and CSS - Free online course at Udacity: https://classroom.udacity.com/courses/ud304

- D3 Visualization Package - One-time free course at Rithm School (via meetup.com): https://www.meetup.com/meetup-code-your-face-off/events/241379532/

| Previous | 
|:---------|
| [Development Environment](./02_development_environment.md) |
