# datasci-sba (Small Business Association
Data Science Working Group working with the Small Business Administration (SBA) to create interactive applications, models, visualizations, and much more.

This project is part of [Data Science Working Group at Code for San Francisco](https://github.com/sfbrigade/data-science-wg)

## Project Description
At a fundamental level, what the SBA does is a public/private partnership. The SBA is a federal government agency, albeit fairly decentralized. In particular, business owners very rarely interact directly with the SBA. For example, a business owner will still go to a bank to get a loan backed by the SBA (as opposed to going directly into an SBA office to get a loan). Another example would be business owners might go to a non-profit funded by an SBA to get counseling. The SBA is engaged with in business support in three primary areas:
1. Finance
2. Education
* Counseling
* Incubator spaces
* Mentoring
* Contracting (helping small businesses with federal government. By law 23 % of federal government contracts are reserved for small businesses)
3. Disaster Relief
* Can get financing after disaster hits

The SBA district office plays a compliance role (making sure partners live up to agreement). They also make the case of SBA programs and bring in new partners. Ideally, we want to be able to identify successful, popular businesses that benefited from SBA programs.

Cities don't know SBA exists because SBA doesn't necessarily fund them. This is a problem especially from disaster relief perspective

Description of Challenges
Get all loan data for SBA data made open and public.
People want to know who are benefiting SBA loans
One challenge is to visualize and identify businesses who have received SBA funding.

One of the largest challenges to SBA is increasing their profile so people know who they are

SBA definition of Small Business
* 500 employees or fewer and under $7.5 million in annual revenues.  (for the complicated answer, see [here](https://www.sba.gov/contracting/getting-started-contractor/make-sure-you-meet-sba-size-standards/table-small-business-size-standards) 
* Exclude public traded companies, etc. 

Two major challenges from office perspective
1. Identifying businesses who have benefited from SBA program
* Even 7a or 504 program, businesses move, businsses change names, etc.
* The big spreadsheet is not the most accessible either.
* Goal: Map this data out!!

2. We have limited personnel, limited resources. Currently decisions being made about where we are doing outreach, where we are going to do partnership, right now it's a bit haphazard.
* We would rather focus our outreach efforts towards underserved areas. (In generally we want a way to figure out how to prioritize certain areas)

[Problem Statements](https://docs.google.com/document/u/1/d/1snCqR35VbrRRzY35Okvrc7iNjOx-uy5GpmxDm1wvCJ4/edit?usp=sharing)

### Live links

## Contributing DSWG Members
### Slack Channel: #datasci-sba
| Name | Slack Handle | Contribution |

| Vincent La| vincela14 | --- |

## Tech

## Contributing

[Fork this repo](https://help.github.com/articles/fork-a-repo/), then clone your repo locally
```
$ git clone <your-repo>
$ cd <this-repo's-name>
$ git remote add upstream <this-repo>
```
Create a feature branch:
```
$ git checkout -b <feature-branch>
```
Do some work:  
```
$ vim <some-files>
```
When you're ready, commit, [merge any upstream changes](https://help.github.com/articles/merging-an-upstream-repository-into-your-fork/), [deal with conflicts](https://help.github.com/articles/resolving-a-merge-conflict-from-the-command-line/), and push your branch ([aka, forking workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow))   
```
$ git add <edited-files>
$ git commit -m 'my awesome feature'
$ git pull upstream master
  # solve conflicts
$ git push
```
[Create a Pull Request](https://help.github.com/articles/creating-a-pull-request/) from your pushed branch (compare branch) to this repo (base branch)   
...  
Profit!
