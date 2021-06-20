namespace Domain
{
    public class UserFollowing
    {
        public string ObserverId { get; set; }
        public AppUser Observer { get; set; } // Person following the target
        public string TargetId { get; set; }
        public AppUser Target { get; set; }
    }
}