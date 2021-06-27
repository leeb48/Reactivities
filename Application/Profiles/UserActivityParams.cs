using Application.Core;

namespace Application.Profiles
{
    public class UserActivityParams : PagingParams
    {
        public string Predicate { get; set; }
    }
}