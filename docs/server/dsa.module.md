This file contains all the information regarding the DSA module that has been created so far in the project. The following task is what is contained in the document.

## Topics Contained

- `Controllers Involved`
- `API Documentation`
- `flow of problem creation`

## Controllers Involved

For the execution of the code, there are a few classes that are involved, them being `dsa-question` and `dsa-submission`.
Now while it would be better segregation to divide each module/characterstics of the DSA question into its own class but that would create too many files only increasing the code complexity in the initial phases, instead we have used a simple way of classifying things based on how closely any property is co-related to the admin/ user controller.

`dsa-question` classes consist of two major properties of the code them being showcasing of the problem statements and creation/updation of the problem statement. Since it is the admin who controlls this we kept this under a same class where it has a few properties like.

- ProblemTestCase
- topic tag
- template
- test-cases
- solution

This definitely voilated the SRP Principal in SOLID principles but for a comparatively smaller team and quick delivery retention these have been created, later on it can seperated into even smaller pieces in a much easier sense.

`dsa submission` class however tackles only the property realted to user submissions. For example if there is any student who submitted the problems and how admins handles them. Later on this can further be added into generation of report per questions which for now is out of scope of this particular contract.

## API Documentation

The api Documentation of the DSA propotion is linked in the url to [postman](https://documenter.getpostman.com/view/38279441/2sBXVhCW4x).

## Flow of Problem Creation

An admin will be creating a problem with the given data required for a problem. All the description is stored inside of a markdown format so that it can be kept dynamic and not fixed. Later on once the problem is created, he can navigate via the admin dashboard to create templates for various applications as well as the testcases, solution and all the stuff required by them.

---

### How to Add a new Question
