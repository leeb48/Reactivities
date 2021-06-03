namespace Application.Interfaces
{
    // Allow the applicatio to retreive the currently 
    // authenticated user's username from anywhere
    // inside the application.
    public interface IUserAccessor
    {
        string GetUsername();
    }
}